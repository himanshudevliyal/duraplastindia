import cluster from "cluster";
import os from "os";
import fastify from "fastify";
import config from "./app/config/index.js";
import server from "./server.js";
import { sequelize } from "./app/db/postgres.js";
import migration from "./app/db/index.js";
import { MIGRATIONS, up as runMigrations } from "./scripts/lib/runner.js";

const numCPUs = os.cpus().length;

// worker exit code: the port is taken (restarting would not help)
const EXIT_PORT_IN_USE = 3;

// stop the workers and the primary
function stopAll() {
  cluster.removeAllListeners("exit");
  for (const worker of Object.values(cluster.workers ?? {})) worker?.process.kill();
  setTimeout(() => process.exit(1), 500);
}

async function initDatabase() {
  await sequelize.authenticate();

  // define models
  await migration.init(sequelize);

  // create tables (DEV ONLY)
  await sequelize.sync({ alter: true });

  // pending migrations (server/migrations, same as `npm run migrate:up`).
  // Set AUTO_MIGRATE=false to only run them by hand.
  // A failed migration is rolled back (nothing half-applied); the server still
  // starts, and `npm run migrate:up` shows the error again.
  if (process.env.AUTO_MIGRATE !== "false") {
    try {
      await runMigrations(MIGRATIONS);
    } catch (error) {
      console.error("Migration failed (rolled back):", error.message);
    }
  }
}

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} running`);

  try {
    // 1️⃣ Create tables once
    await initDatabase();

    // 2️⃣ Fork workers (WORKERS env overrides the CPU count)
    const workers = Number(process.env.WORKERS) > 0 ? Number(process.env.WORKERS) : numCPUs;
    for (let i = 0; i < workers; i++) {
      cluster.fork();
    }

    // A crashed worker is restarted after a short pause. If the port is
    // taken, or workers keep crashing, the server stops with a message
    // instead of restarting forever (which spawned endless processes).
    let crashes = [];
    cluster.on("exit", (worker, code) => {
      if (code === EXIT_PORT_IN_USE) {
        console.error(`\nPort ${config.port} is already in use. Close the other server and start again.\n`);
        return stopAll();
      }
      const now = Date.now();
      crashes = [...crashes.filter((t) => now - t < 60 * 1000), now];
      if (crashes.length >= 5) {
        console.error("\nWorkers crashed 5 times in a minute. Stopping — fix the error above and start again.\n");
        return stopAll();
      }
      console.log(`Worker ${worker.process.pid} died. Restarting in 2s...`);
      setTimeout(() => cluster.fork(), 2000);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
} else {
  // primary gone (terminal closed, nodemon restart) => stop this worker
  // too, so it never keeps the port busy in the background
  process.on("disconnect", () => process.exit(0));

  try {
    // Workers only connect + define models
    await sequelize.authenticate();
    migration.init(sequelize);

    const app = fastify({ logger: true });
    await server(app);

    await app.listen({
      port: config.port,
      host: "0.0.0.0",
    });

    console.log(`Worker ${process.pid} started`);
  } catch (err) {
    console.error(err);
    process.exit(err?.code === "EADDRINUSE" ? EXIT_PORT_IN_USE : 1);
  }
}
