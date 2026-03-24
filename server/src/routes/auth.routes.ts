import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env.js";
import { loadDb, withDb } from "../data/store.js";
import { makeId } from "../utils/ids.js";
import type { Role } from "../types/models.js";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["admin", "citizen"]),
});

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["admin", "citizen"]),
});

function signToken(user: { id: string; role: Role; email: string; name: string }): string {
  const signOptions: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"] };

  return jwt.sign(
    { sub: user.id, role: user.role, email: user.email, name: user.name },
    env.JWT_SECRET,
    signOptions,
  );
}

export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  const body = loginSchema.parse(req.body);
  const db = await loadDb();

  const user = db.users.find((candidate) => candidate.email.toLowerCase() === body.email.toLowerCase() && candidate.role === body.role);

  if (!user) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const isMatch = await bcrypt.compare(body.password, user.passwordHash);
  if (!isMatch) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const token = signToken({ id: user.id, role: user.role, email: user.email, name: user.name });

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

authRouter.post("/signup", async (req, res) => {
  const body = signupSchema.parse(req.body);
  const exists = (await loadDb()).users.some((user) => user.email.toLowerCase() === body.email.toLowerCase());

  if (exists) {
    res.status(409).json({ message: "Email already registered" });
    return;
  }

  const passwordHash = await bcrypt.hash(body.password, 10);

  const user = await withDb((db) => {
    const created = {
      id: makeId("usr"),
      name: body.name,
      email: body.email,
      passwordHash,
      role: body.role,
      createdAt: new Date().toISOString(),
    };
    db.users.push(created);
    return created;
  });

  const token = signToken({ id: user.id, role: user.role, email: user.email, name: user.name });
  res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});
