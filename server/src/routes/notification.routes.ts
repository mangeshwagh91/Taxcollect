import { Router } from "express";
import { z } from "zod";
import { withDb } from "../data/store.js";
import { requireAuth } from "../middleware/auth.js";

export const notificationRouter = Router();

notificationRouter.use(requireAuth);

notificationRouter.get("/", async (req, res) => {
  const notifications = await withDb((db) => {
    if (req.user?.role === "admin") return db.notifications;
    return db.notifications.filter((item) => !item.userId || item.userId === req.user?.sub);
  });

  res.json({ data: notifications, count: notifications.length });
});

notificationRouter.patch("/:id/read", async (req, res) => {
  const { id } = z.object({ id: z.string() }).parse(req.params);
  const body = z.object({ read: z.boolean() }).parse(req.body);

  const updated = await withDb((db) => {
    const notification = db.notifications.find((candidate) => candidate.id === id);
    if (!notification) return null;
    if (req.user?.role === "citizen" && notification.userId && notification.userId !== req.user.sub) return null;
    notification.read = body.read;
    return notification;
  });

  if (!updated) {
    res.status(404).json({ message: "Notification not found" });
    return;
  }

  res.json(updated);
});
