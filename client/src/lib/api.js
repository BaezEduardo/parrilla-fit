// ⬇️ agrega esta línea arriba
const API_URL = import.meta.env.VITE_API_URL || "";   // prod: https://api.parrillafit.castelancarpinteyro.com

// ⬇️ reemplaza tu línea actual por esta
const BASE = API_URL ? `${API_URL}/api` : "/api";

console.log("API_URL =", import.meta.env.VITE_API_URL, "BASE =", BASE);
// lo demás queda igual
export async function getMenu() {
  const res = await fetch(`${BASE}/menu`);
  if (!res.ok) throw new Error("Error al cargar el menú");
  return res.json();
}
