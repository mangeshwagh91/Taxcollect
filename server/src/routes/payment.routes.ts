import { Router } from "express";
import { z } from "zod";
import { withDb } from "../data/store.js";
import { requireAuth } from "../middleware/auth.js";
import { makeId, makeReceiptNo } from "../utils/ids.js";

const createPaymentSchema = z.object({
  propertyId: z.string(),
  amount: z.number().positive(),
  method: z.enum(["UPI", "Net Banking", "Card", "Cash"]),
});

export const paymentRouter = Router();

paymentRouter.use(requireAuth);

paymentRouter.get("/", async (req, res) => {
  const payments = await withDb((db) => {
    if (req.user?.role === "admin") return db.payments;

    const ownedPropertyIds = new Set(
      db.properties
        .filter((property) => property.ownerUserId === req.user?.sub)
        .map((property) => property.id),
    );

    return db.payments.filter((payment) => ownedPropertyIds.has(payment.propertyId));
  });

  res.json({ data: payments, count: payments.length });
});

paymentRouter.post("/", async (req, res) => {
  const body = createPaymentSchema.parse(req.body);

  const result = await withDb((db) => {
    const property = db.properties.find((candidate) => candidate.id === body.propertyId);
    if (!property) return { error: "Property not found" as const };

    if (req.user?.role === "citizen" && property.ownerUserId && property.ownerUserId !== req.user.sub) {
      return { error: "Forbidden" as const };
    }

    const payment = {
      id: makeId("PAY"),
      propertyId: body.propertyId,
      amount: body.amount,
      date: new Date().toISOString(),
      method: body.method,
      status: "completed" as const,
      receiptNo: makeReceiptNo(),
    };

    db.payments.push(payment);
    property.paymentStatus = "paid";
    property.lastPaymentDate = payment.date;

    db.notifications.unshift({
      id: makeId("n"),
      title: "Payment Confirmed",
      message: `Payment of Rs.${body.amount.toLocaleString()} recorded for ${property.id}.`,
      type: "success",
      date: payment.date,
      read: false,
      userId: req.user?.sub,
    });

    return { payment };
  });

  if ("error" in result) {
    if (result.error === "Property not found") {
      res.status(404).json({ message: result.error });
      return;
    }
    res.status(403).json({ message: result.error });
    return;
  }

  res.status(201).json(result.payment);
});
