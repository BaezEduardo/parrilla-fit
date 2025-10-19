import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

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

app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});
