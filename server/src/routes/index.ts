import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { propertyRouter } from "./property.routes.js";
import { paymentRouter } from "./payment.routes.js";
import { notificationRouter } from "./notification.routes.js";
import { analyticsRouter } from "./analytics.routes.js";
import { chatbotRouter } from "./chatbot.routes.js";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "taxcollect-backend", timestamp: new Date().toISOString() });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/properties", propertyRouter);
apiRouter.use("/payments", paymentRouter);
apiRouter.use("/notifications", notificationRouter);
apiRouter.use("/analytics", analyticsRouter);
apiRouter.use("/chatbot", chatbotRouter);
