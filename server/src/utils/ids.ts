export function makeId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function makeReceiptNo(): string {
  return `RCP-${Date.now()}-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`;
}
