import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";

const chatbotSchema = z.object({
  message: z.string().min(1),
});

function answerFor(message: string): string {
  const normalized = message.toLowerCase();

  if (normalized.includes("due") || normalized.includes("deadline")) {
    return "Property tax dues are typically assessed annually. Check your dashboard for exact due dates per property.";
  }

  if (normalized.includes("pay") || normalized.includes("payment")) {
    return "You can pay tax from the Payments section using UPI, Card, Net Banking, or Cash entry.";
  }

  if (normalized.includes("receipt")) {
    return "Receipts are generated after successful payment and available in your payment history.";
  }

  if (normalized.includes("unpaid") || normalized.includes("defaulter")) {
    return "Use the defaulters view to list unpaid properties and filter by ward or zone.";
  }

  return "I can help with tax payments, due status, receipts, and property records. Ask a specific question for better guidance.";
}

export const chatbotRouter = Router();

chatbotRouter.use(requireAuth);
chatbotRouter.post("/", (req, res) => {
  const { message } = chatbotSchema.parse(req.body);
  const reply = answerFor(message);
  res.json({ reply, timestamp: new Date().toISOString() });
});
