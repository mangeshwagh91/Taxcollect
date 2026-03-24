import bcrypt from "bcryptjs";
import type { Database, PaymentMethod, Property, PropertyType, User } from "../types/models.js";
import { calculateTax } from "../services/tax.service.js";

const wards = ["Ward A", "Ward B", "Ward C", "Ward D", "Ward E"];
const zones = ["Zone 1 - Premium", "Zone 2 - Central", "Zone 3 - Suburban", "Zone 4 - Rural"];
const names = [
  "Rajesh Kumar", "Priya Sharma", "Amit Patel", "Sunita Devi", "Vikram Singh",
  "Anita Gupta", "Deepak Verma", "Meena Joshi", "Sanjay Reddy", "Kavita Nair",
  "Ravi Shankar", "Pooja Mishra", "Arun Tiwari", "Lakshmi Iyer", "Manoj Yadav",
  "Neha Kapoor", "Suresh Menon", "Rina Das", "Gopal Saxena", "Divya Pillai",
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T;
}

function seededProperties(count: number, citizenUserId: string): Property[] {
  const baseLat = 19.076;
  const baseLng = 72.8777;

  return Array.from({ length: count }, (_, i) => {
    const isPaid = Math.random() > 0.4;
    const type: PropertyType = Math.random() > 0.3 ? "residential" : "commercial";
    const area = type === "residential" ? 800 + Math.floor(Math.random() * 2200) : 1500 + Math.floor(Math.random() * 5000);
    const zone = randomFrom(zones);
    const taxAmount = calculateTax(area, type, zone);

    const yearsAgo = isPaid ? 0 : Math.floor(Math.random() * 4) + 1;
    const lastPaymentDate = isPaid
      ? new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString()
      : yearsAgo > 1
        ? new Date(2025 - yearsAgo, Math.floor(Math.random() * 12), 1).toISOString()
        : null;

    return {
      id: `PROP-${String(i + 1).padStart(4, "0")}`,
      ownerName: names[i % names.length] ?? "Unknown Owner",
      ownerUserId: i % 5 === 0 ? citizenUserId : undefined,
      location: {
        lat: baseLat + (Math.random() - 0.5) * 0.08,
        lng: baseLng + (Math.random() - 0.5) * 0.08,
      },
      address: `${Math.floor(Math.random() * 500) + 1}, ${["MG Road", "Park Street", "Linking Road", "Station Road", "Gandhi Nagar"][i % 5]}, Mumbai`,
      area,
      type,
      zone,
      taxAmount,
      paymentStatus: isPaid ? "paid" : "unpaid",
      lastPaymentDate,
      ward: wards[i % wards.length] ?? "Ward A",
    };
  });
}

export async function createSeedData(): Promise<Database> {
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const citizenPasswordHash = await bcrypt.hash("citizen123", 10);

  const users: User[] = [
    {
      id: "usr-admin-1",
      name: "Admin Officer",
      email: "admin@tax.local",
      passwordHash: adminPasswordHash,
      role: "admin",
      createdAt: new Date().toISOString(),
    },
    {
      id: "usr-citizen-1",
      name: "Citizen User",
      email: "citizen@tax.local",
      passwordHash: citizenPasswordHash,
      role: "citizen",
      createdAt: new Date().toISOString(),
    },
  ];

  const properties = seededProperties(50, users[1].id);

  const methods: PaymentMethod[] = ["UPI", "Net Banking", "Card", "Cash"];
  const payments = properties
    .filter((property) => property.paymentStatus === "paid")
    .map((property, index) => ({
      id: `PAY-${String(index + 1).padStart(4, "0")}`,
      propertyId: property.id,
      amount: property.taxAmount,
      date: property.lastPaymentDate ?? new Date().toISOString(),
      method: randomFrom(methods),
      status: "completed" as const,
      receiptNo: `RCP-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
    }));

  const notifications = [
    {
      id: "n1",
      title: "Tax Due Reminder",
      message: "Your property tax for PROP-0003 is overdue by 6 months.",
      type: "warning" as const,
      date: "2025-12-15",
      read: false,
      userId: users[1].id,
    },
    {
      id: "n2",
      title: "New Property Added",
      message: "Property PROP-0051 has been registered in Ward C.",
      type: "info" as const,
      date: "2025-12-10",
      read: false,
    },
    {
      id: "n3",
      title: "Payment Confirmed",
      message: "Payment has been confirmed.",
      type: "success" as const,
      date: "2025-12-08",
      read: true,
    },
  ];

  return { users, properties, payments, notifications };
}
