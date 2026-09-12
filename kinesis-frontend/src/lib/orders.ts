export interface Order {
  id: string;
  date: string;
  items: string;
  sub: string;
  total: string;
}

const KEY = "kinesis-orders";

export function readOrders(): Order[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = JSON.parse(raw ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (o): o is Order =>
        typeof o === "object" &&
        o !== null &&
        typeof (o as Order).id === "string" &&
        typeof (o as Order).items === "string",
    );
  } catch {
    return [];
  }
}

export function saveOrder(order: Order) {
  try {
    const prev = readOrders();
    localStorage.setItem(KEY, JSON.stringify([order, ...prev].slice(0, 20)));
  } catch {
    localStorage.removeItem(KEY);
  }
}

export function todayVI(): string {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}
