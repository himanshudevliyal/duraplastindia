// Small migration / seed runner (no extra packages).
//
// Every file in the folder is one step, run in name order. A step exports
//   export async function up({ sequelize, queryInterface, transaction }) {}
//   export async function down({ sequelize, queryInterface, transaction }) {}
// Steps that ran are stored in a table, so each runs only once.
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { sequelize } from "../../app/db/postgres.js";

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

export const MIGRATIONS = {
  label: "migration",
  dir: path.join(serverRoot, "migrations"),
  table: "schema_migrations",
};

export const SEEDS = {
  label: "seed",
  dir: path.join(serverRoot, "seeders"),
  table: "schema_seeds",
};

async function ensureTable({ table }) {
  await sequelize.query(
    `CREATE TABLE IF NOT EXISTS "${table}" (
       name TEXT PRIMARY KEY,
       run_at TIMESTAMPTZ NOT NULL DEFAULT now()
     )`,
  );
}

function stepFiles({ dir }) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".js"))
    .sort();
}

async function appliedSteps({ table }) {
  const [rows] = await sequelize.query(
    `SELECT name, run_at FROM "${table}" ORDER BY name`,
  );
  return new Map(rows.map((r) => [r.name, r.run_at]));
}

async function runStep(kind, file, direction) {
  const step = await import(pathToFileURL(path.join(kind.dir, file)).href);
  if (typeof step[direction] !== "function") {
    throw new Error(`${file} has no "${direction}" function.`);
  }

  const transaction = await sequelize.transaction();
  try {
    await step[direction]({
      sequelize,
      queryInterface: sequelize.getQueryInterface(),
      transaction,
    });

    if (direction === "up") {
      await sequelize.query(`INSERT INTO "${kind.table}" (name) VALUES ($1)`, {
        bind: [file],
        transaction,
      });
    } else {
      await sequelize.query(`DELETE FROM "${kind.table}" WHERE name = $1`, {
        bind: [file],
        transaction,
      });
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    error.message = `${kind.label} ${file} (${direction}) failed: ${error.message}`;
    throw error;
  }
}

// Runs every pending step. Returns the names that ran.
export async function up(kind) {
  await ensureTable(kind);
  const applied = await appliedSteps(kind);
  const pending = stepFiles(kind).filter((f) => !applied.has(f));

  for (const file of pending) {
    await runStep(kind, file, "up");
    console.log(`  ✔ ${kind.label} up: ${file}`);
  }
  if (!pending.length) console.log(`  No pending ${kind.label}s.`);
  return pending;
}

// Reverts the last step that ran (or `name`, if given).
export async function down(kind, name) {
  await ensureTable(kind);
  const applied = [...(await appliedSteps(kind)).keys()];
  const file = name || applied[applied.length - 1];

  if (!file) return console.log(`  Nothing to revert.`);
  if (!applied.includes(file)) throw new Error(`${file} has not run.`);

  await runStep(kind, file, "down");
  console.log(`  ✔ ${kind.label} down: ${file}`);
}

export async function status(kind) {
  await ensureTable(kind);
  const applied = await appliedSteps(kind);
  const files = stepFiles(kind);

  if (!files.length) return console.log(`  No ${kind.label} files in ${kind.dir}`);
  for (const file of files) {
    const at = applied.get(file);
    console.log(
      at ? `  [x] ${file}  (${new Date(at).toLocaleString()})` : `  [ ] ${file}`,
    );
  }
}

// CLI: node scripts/<migrate|seed>.js <up|down|status> [name]
export async function cli(kind) {
  const [command = "status", name] = process.argv.slice(2);
  try {
    await sequelize.authenticate();
    if (command === "up") await up(kind);
    else if (command === "down") await down(kind, name);
    else if (command === "status") await status(kind);
    else throw new Error(`Unknown command "${command}" (use up | down | status).`);
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error(`✖ ${error.message}`);
    await sequelize.close().catch(() => {});
    process.exit(1);
  }
}
