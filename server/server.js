import express from "express";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import authRoutes from "./routes/auth.js";
import prefRoutes from "./routes/preferences.js";
import Airtable from "airtable";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/preferences", prefRoutes);
app.get("/health", (_req, res) => res.send("ok"));
app.get("/", (_req, res) => res.send("API Parrilla Fit funcionando ✅"));
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
app.get("/data", async (req, res) => {
  try {
    const records = await base("Clientes").select({}).all();
    const data = records.map(r => r.fields);
    res.json(data);
  } catch (err) {
    res.status(500).send(err);
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
  console.log(`API running on port ${PORT}`);
});