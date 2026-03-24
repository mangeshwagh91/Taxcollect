export interface Property {
  id: string;
  ownerName: string;
  location: { lat: number; lng: number };
  address: string;
  area: number;
  type: "residential" | "commercial";
  zone: string;
  taxAmount: number;
  paymentStatus: "paid" | "unpaid";
  lastPaymentDate: string | null;
  ward: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "citizen";
  avatar?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "warning" | "info" | "success";
  date: string;
  read: boolean;
}

export interface PaymentRecord {
  id: string;
  propertyId: string;
  amount: number;
  date: string;
  method: string;
  status: "completed" | "pending" | "failed";
  receiptNo: string;
}

const wards = ["Ward A", "Ward B", "Ward C", "Ward D", "Ward E"];
const zones = ["Zone 1 - Premium", "Zone 2 - Central", "Zone 3 - Suburban", "Zone 4 - Rural"];
const names = [
  "Rajesh Kumar", "Priya Sharma", "Amit Patel", "Sunita Devi", "Vikram Singh",
  "Anita Gupta", "Deepak Verma", "Meena Joshi", "Sanjay Reddy", "Kavita Nair",
  "Ravi Shankar", "Pooja Mishra", "Arun Tiwari", "Lakshmi Iyer", "Manoj Yadav",
  "Neha Kapoor", "Suresh Menon", "Rina Das", "Gopal Saxena", "Divya Pillai",
  "Mohan Jha", "Swati Banerjee", "Kiran Desai", "Usha Rao", "Prakash Choudhary",
];

const baseLat = 19.076;
const baseLng = 72.8777;

export const properties: Property[] = Array.from({ length: 50 }, (_, i) => {
  const isPaid = Math.random() > 0.4;
  const type = Math.random() > 0.3 ? "residential" : "commercial";
  const area = type === "residential" ? 800 + Math.floor(Math.random() * 2200) : 1500 + Math.floor(Math.random() * 5000);
  const zone = zones[Math.floor(Math.random() * zones.length)];
  const zoneMultiplier = zone.includes("Premium") ? 3 : zone.includes("Central") ? 2 : zone.includes("Suburban") ? 1.2 : 0.8;
  const typeMultiplier = type === "commercial" ? 1.5 : 1;
  const taxAmount = Math.round(area * zoneMultiplier * typeMultiplier * 2.5);

  const yearsAgo = isPaid ? 0 : Math.floor(Math.random() * 4) + 1;
  const lastPayDate = isPaid
    ? new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString()
    : yearsAgo > 1
      ? new Date(2024 - yearsAgo, Math.floor(Math.random() * 12), 1).toISOString()
      : null;

  return {
    id: `PROP-${String(i + 1).padStart(4, "0")}`,
    ownerName: names[i % names.length],
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
    lastPaymentDate: lastPayDate,
    ward: wards[i % wards.length],
  };
});

export const paymentHistory: PaymentRecord[] = properties
  .filter((p) => p.paymentStatus === "paid")
  .map((p) => ({
    id: `PAY-${p.id}`,
    propertyId: p.id,
    amount: p.taxAmount,
    date: p.lastPaymentDate!,
    method: ["UPI", "Net Banking", "Card", "Cash"][Math.floor(Math.random() * 4)],
    status: "completed" as const,
    receiptNo: `RCP-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
  }));

export const notifications: Notification[] = [
  { id: "n1", title: "Tax Due Reminder", message: "Your property tax for PROP-0003 is overdue by 6 months.", type: "warning", date: "2024-12-15", read: false },
  { id: "n2", title: "New Property Added", message: "Property PROP-0051 has been registered in Ward C.", type: "info", date: "2024-12-10", read: false },
  { id: "n3", title: "Payment Confirmed", message: "Payment of ₹45,000 for PROP-0012 has been confirmed.", type: "success", date: "2024-12-08", read: true },
  { id: "n4", title: "Assessment Update", message: "Tax assessment for Zone 2 properties has been revised.", type: "info", date: "2024-12-05", read: true },
  { id: "n5", title: "Overdue Notice", message: "15 properties in Ward A have taxes overdue for >1 year.", type: "warning", date: "2024-12-01", read: false },
];

export function calculateTax(area: number, type: "residential" | "commercial", zone: string): number {
  const zoneMultiplier = zone.includes("Premium") ? 3 : zone.includes("Central") ? 2 : zone.includes("Suburban") ? 1.2 : 0.8;
  const typeMultiplier = type === "commercial" ? 1.5 : 1;
  return Math.round(area * zoneMultiplier * typeMultiplier * 2.5);
}

export const monthlyRevenue = [
  { month: "Jan", revenue: 245000 }, { month: "Feb", revenue: 312000 },
  { month: "Mar", revenue: 428000 }, { month: "Apr", revenue: 380000 },
  { month: "May", revenue: 290000 }, { month: "Jun", revenue: 510000 },
  { month: "Jul", revenue: 465000 }, { month: "Aug", revenue: 395000 },
  { month: "Sep", revenue: 520000 }, { month: "Oct", revenue: 610000 },
  { month: "Nov", revenue: 480000 }, { month: "Dec", revenue: 550000 },
];

export const wardRevenue = wards.map((ward) => ({
  ward,
  revenue: properties.filter((p) => p.ward === ward && p.paymentStatus === "paid").reduce((sum, p) => sum + p.taxAmount, 0),
  total: properties.filter((p) => p.ward === ward).reduce((sum, p) => sum + p.taxAmount, 0),
}));
