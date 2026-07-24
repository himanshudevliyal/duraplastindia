import cluster from "cluster";
import os from "os";
import fastify from "fastify";
import config from "./app/config/index.js";
import server from "./server.js";
import { sequelize } from "./app/db/postgres.js";
import migration from "./app/db/index.js";

const numCPUs = os.cpus().length;

async function initDatabase() {
  await sequelize.authenticate();

  // define models
  await migration.init(sequelize);

  // create tables (DEV ONLY)
  await sequelize.sync({ alter: true });
}

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} running`);

  try {
    // 1️⃣ Create tables once
    await initDatabase();

    // 2️⃣ Fork workers
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on("exit", (worker) => {
      console.log(`Worker ${worker.process.pid} died. Restarting...`);
      cluster.fork();
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
} else {
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
    process.exit(1);
  }
}
