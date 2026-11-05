// Dashboard admin user (npm run seed).
// Reads SEED_ADMIN_USERNAME, SEED_ADMIN_PASSWORD and (optional)
// SEED_ADMIN_NAME from server/.env. An existing user is left unchanged.
import { randomUUID } from "crypto";
import constants from "../app/lib/constants/index.js";
import hash from "../app/lib/encryption/index.js";

const table = constants.models.USER_TABLE;

export async function up({ sequelize, transaction }) {
  const username = process.env.SEED_ADMIN_USERNAME?.trim();
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!username || !password) {
    throw new Error(
      "Set SEED_ADMIN_USERNAME and SEED_ADMIN_PASSWORD in server/.env first.",
    );
  }

  const [existing] = await sequelize.query(
    `SELECT id FROM ${table} WHERE username = $1`,
    { bind: [username], transaction },
  );
  if (existing.length) {
    console.log(`    user "${username}" already exists — not changed`);
    return;
  }

  await sequelize.query(
    `INSERT INTO ${table}
       (id, username, fullname, password, role, is_active, created_at, updated_at)
     VALUES ($1, $2, $3, $4, 'super_admin', true, now(), now())`,
    {
      bind: [
        randomUUID(),
        username,
        process.env.SEED_ADMIN_NAME || "Admin",
        hash.encrypt(password),
      ],
      transaction,
    },
  );
  console.log(`    created super admin "${username}"`);
}

// Removes the seeded admin (only that username).
export async function down({ sequelize, transaction }) {
  const username = process.env.SEED_ADMIN_USERNAME?.trim();
  if (!username) return;
  await sequelize.query(`DELETE FROM ${table} WHERE username = $1`, {
    bind: [username],
    transaction,
  });
}
