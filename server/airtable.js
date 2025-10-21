import Airtable from "airtable";

// Lee variables de entorno definidas en .env
const {
  AIRTABLE_TOKEN,
  AIRTABLE_BASE_ID,
  AIRTABLE_TABLE_USERS = "Users",
} = process.env;

// Aviso si falta configuración (evita fallos silenciosos)
if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
  console.warn(
    "[Airtable] Faltan variables de entorno: AIRTABLE_TOKEN y/o AIRTABLE_BASE_ID"
  );
}

// Instancia base
const base = new Airtable({ apiKey: AIRTABLE_TOKEN }).base(AIRTABLE_BASE_ID);

// Acceso a la tabla Users (permite renombrar con AIRTABLE_TABLE_USERS si algún día cambias)
export const usersTable = () => base(AIRTABLE_TABLE_USERS);

/**
 * Busca un usuario por teléfono (único).
 * @param {string} phone
 * @returns {Promise<Airtable.Record | null>}
 */
export async function findUserByPhone(phone) {
  // filterByFormula filtrará por el campo "Phone"
  const res = await usersTable()
    .select({ filterByFormula: `{Phone} = '${phone}'`, maxRecords: 1 })
    .firstPage();
  return res[0] || null;
}

/**
 * Busca un usuario por recordId (id interno de Airtable).
 * Útil para preferencias.
 * @param {string} recordId
 * @returns {Promise<Airtable.Record | null>}
 */
export async function findUserById(recordId) {
  try {
    const rec = await usersTable().find(recordId);
    return rec || null;
  } catch {
    return null;
  }
}

/**
 * Crea un usuario nuevo.
 * @param {{name: string, phone: string, passwordHash: string, role?: "user" | "admin"}} payload
 * @returns {Promise<Airtable.Record>}
 */
export async function createUser({ name, phone, passwordHash, role = "user" }) {
  const recs = await usersTable().create([
    {
      fields: {
        Name: name,
        Phone: phone,
        PasswordHash: passwordHash,
        Role: role,
      },
    },
  ]);
  return recs[0];
}

/**
 * Actualiza preferencias (gustos y alérgenos) por recordId.
 * @param {string} recordId
 * @param {{likes?: string[], dislikes?: string[], allergies?: string[]}} payload
 * @returns {Promise<Airtable.Record>}
 */
export async function updatePreferences(
  recordId,
  { likes = [], dislikes = [], allergies = [] }
) {
  // Normalizar valores: arreglos de strings, sin falsy, trim
  const norm = (arr) =>
    Array.isArray(arr)
      ? arr.filter(Boolean).map((v) => String(v).trim()).filter(Boolean)
      : [];

  const fields = {
    Likes: norm(likes),
    Dislikes: norm(dislikes),
    Allergies: norm(allergies),
  };

  const recs = await usersTable().update([{ id: recordId, fields }]);
  return recs[0];
}



export async function updatePasswordHash(recordId, passwordHash) {
  const recs = await usersTable().update([
    { id: recordId, fields: { PasswordHash: passwordHash } }
  ]);
  return recs[0];
}

/**
 * Formatea un registro de Airtable a JSON limpio para el cliente.
 * Evita exponer PasswordHash.
 */
export function userRecordToJSON(rec) {
  if (!rec) return null;
  return {
    id: rec.id,
    name: rec.get("Name") || "",
    phone: rec.get("Phone") || "",
    role: rec.get("Role") || "user",
    likes: rec.get("Likes") || [],
    dislikes: rec.get("Dislikes") || [],
    allergies: rec.get("Allergies") || [],
  };
}
