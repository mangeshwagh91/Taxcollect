export type Role = "admin" | "citizen";
export type PropertyType = "residential" | "commercial";
export type PaymentStatus = "paid" | "unpaid";
export type PaymentMethod = "UPI" | "Net Banking" | "Card" | "Cash";
export type PaymentRecordStatus = "completed" | "pending" | "failed";
export type NotificationType = "warning" | "info" | "success";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: string;
}

export interface Property {
  id: string;
  ownerName: string;
  ownerUserId?: string;
  location: { lat: number; lng: number };
  address: string;
  area: number;
  type: PropertyType;
  zone: string;
  taxAmount: number;
  paymentStatus: PaymentStatus;
  lastPaymentDate: string | null;
  ward: string;
}

export interface PaymentRecord {
  id: string;
  propertyId: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  status: PaymentRecordStatus;
  receiptNo: string;
}

export interface Notification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: NotificationType;
  date: string;
  read: boolean;
}

export interface Database {
  users: User[];
  properties: Property[];
  payments: PaymentRecord[];
  notifications: Notification[];
}
