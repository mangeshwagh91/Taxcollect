import type { PropertyType } from "../types/models.js";

export function calculateTax(area: number, type: PropertyType, zone: string): number {
  const zoneMultiplier = zone.includes("Premium") ? 3 : zone.includes("Central") ? 2 : zone.includes("Suburban") ? 1.2 : 0.8;
  const typeMultiplier = type === "commercial" ? 1.5 : 1;
  return Math.round(area * zoneMultiplier * typeMultiplier * 2.5);
}
