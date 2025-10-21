const BASE = "/api";

export async function getMenu() {
  const res = await fetch(`${BASE}/menu`);
  if (!res.ok) throw new Error("Error al cargar el menú");
  return res.json();
}
