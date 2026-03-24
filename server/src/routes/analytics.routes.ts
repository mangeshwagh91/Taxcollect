import { Router } from "express";
import { withDb } from "../data/store.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export const analyticsRouter = Router();

analyticsRouter.use(requireAuth, requireRole("admin"));

analyticsRouter.get("/summary", async (_req, res) => {
  const summary = await withDb((db) => {
    const totalProperties = db.properties.length;
    const paidProperties = db.properties.filter((item) => item.paymentStatus === "paid").length;
    const unpaidProperties = totalProperties - paidProperties;

    const totalTax = db.properties.reduce((sum, item) => sum + item.taxAmount, 0);
    const collectedTax = db.properties
      .filter((item) => item.paymentStatus === "paid")
      .reduce((sum, item) => sum + item.taxAmount, 0);

    const wardRevenue = [...new Set(db.properties.map((item) => item.ward))].map((ward) => {
      const wardProperties = db.properties.filter((item) => item.ward === ward);
      return {
        ward,
        revenue: wardProperties.filter((item) => item.paymentStatus === "paid").reduce((sum, item) => sum + item.taxAmount, 0),
        total: wardProperties.reduce((sum, item) => sum + item.taxAmount, 0),
      };
    });

    const recentPayments = [...db.payments]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    return {
      totalProperties,
      paidProperties,
      unpaidProperties,
      totalTax,
      collectedTax,
      collectionRate: totalTax > 0 ? Number(((collectedTax / totalTax) * 100).toFixed(2)) : 0,
      wardRevenue,
      recentPayments,
    };
  });

  res.json(summary);
});
