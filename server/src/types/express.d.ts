import type { Role } from "./models.js";

declare global {
  namespace Express {
    interface UserPayload {
      sub: string;
      role: Role;
      email: string;
      name: string;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
