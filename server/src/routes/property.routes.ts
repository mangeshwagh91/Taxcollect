import { Router } from "express";
import { z } from "zod";
import { withDb } from "../data/store.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { calculateTax } from "../services/tax.service.js";
import { makeId } from "../utils/ids.js";

const createPropertySchema = z.object({
  ownerName: z.string().min(2),
  ownerUserId: z.string().optional(),
  address: z.string().min(5),
  location: z.object({ lat: z.number(), lng: z.number() }),
  area: z.number().positive(),
  type: z.enum(["residential", "commercial"]),
  zone: z.string().min(2),
  ward: z.string().min(2),
});

const paymentStatusSchema = z.object({
  paymentStatus: z.enum(["paid", "unpaid"]),
  lastPaymentDate: z.string().datetime().nullable().optional(),
});

export const propertyRouter = Router();

propertyRouter.use(requireAuth);

propertyRouter.get("/", async (req, res) => {
  const query = z.object({
    ward: z.string().optional(),
    zone: z.string().optional(),
    status: z.enum(["paid", "unpaid"]).optional(),
    ownerUserId: z.string().optional(),
  }).parse(req.query);

  const properties = await withDb((db) => {
    return db.properties.filter((property) => {
      if (query.ward && property.ward !== query.ward) return false;
      if (query.zone && property.zone !== query.zone) return false;
      if (query.status && property.paymentStatus !== query.status) return false;
      if (query.ownerUserId && property.ownerUserId !== query.ownerUserId) return false;
      if (req.user?.role === "citizen" && property.ownerUserId && property.ownerUserId !== req.user.sub) return false;
      return true;
    });
  });

  res.json({ data: properties, count: properties.length });
});

propertyRouter.post("/", requireRole("admin"), async (req, res) => {
  const body = createPropertySchema.parse(req.body);
  const taxAmount = calculateTax(body.area, body.type, body.zone);

  const created = await withDb((db) => {
    const property = {
      id: makeId("PROP"),
      ownerName: body.ownerName,
      ownerUserId: body.ownerUserId,
      location: body.location,
      address: body.address,
      area: body.area,
      type: body.type,
      zone: body.zone,
      taxAmount,
      paymentStatus: "unpaid" as const,
      lastPaymentDate: null,
      ward: body.ward,
    };

    db.properties.push(property);
    return property;
  });

  res.status(201).json(created);
});

propertyRouter.patch("/:id/payment-status", requireRole("admin"), async (req, res) => {
  const { id } = z.object({ id: z.string() }).parse(req.params);
  const body = paymentStatusSchema.parse(req.body);

  const updated = await withDb((db) => {
    const property = db.properties.find((candidate) => candidate.id === id);
    if (!property) return null;

    property.paymentStatus = body.paymentStatus;
    property.lastPaymentDate = body.paymentStatus === "paid" ? (body.lastPaymentDate ?? new Date().toISOString()) : null;
    return property;
  });

  if (!updated) {
    res.status(404).json({ message: "Property not found" });
    return;
  }

  res.json(updated);
});

propertyRouter.get("/:id", async (req, res) => {
  const { id } = z.object({ id: z.string() }).parse(req.params);

  const property = await withDb((db) => db.properties.find((candidate) => candidate.id === id) ?? null);

  if (!property) {
    res.status(404).json({ message: "Property not found" });
    return;
  }

  if (req.user?.role === "citizen" && property.ownerUserId && property.ownerUserId !== req.user.sub) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  res.json(property);
});
