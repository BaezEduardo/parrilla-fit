import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import "dotenv/config";
import authRoutes from "./routes/auth.js";
import prefRoutes from "./routes/preferences.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/preferences", prefRoutes);

app.get("/api/menu", (_req, res) => {
  try {
    const filePath = path.join(__dirname, "data", "menu.json");
    const json = fs.readFileSync(filePath, "utf-8");
    res.type("application/json").send(json);
  } catch (err) {
    console.error("Error leyendo menu.json:", err);
    res.status(500).json({ error: "No se pudo leer el menú" });
  }
});

app.post("/api/chat", (req, res) => {
  const { message } = req.body || {};
  // Stub simple por ahora
  if (!message) return res.json({ reply: "Cuéntame qué te gusta: carnes, pescados, vegetariano o sin gluten." });

  // En breve: aquí conectamos ChatGPT o n8n con el menú como contexto.
  res.json({ reply: "Gracias. Puedo recomendarte entradas sin lácteos o platos principales sin gluten. ¿Prefieres carnes o marinos?" });
});

app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});
