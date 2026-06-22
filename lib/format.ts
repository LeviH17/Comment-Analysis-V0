export function capitalize(s: string): string {
  if (!s) return s;
  if (s === "non-binary") return "Non-binary";
  return s.charAt(0).toUpperCase() + s.slice(1);
}
