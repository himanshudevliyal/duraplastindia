// npm run migrate:up | migrate:down | migrate:status
// Files: server/migrations/*.js (run in name order, each only once).
import { MIGRATIONS, cli } from "./lib/runner.js";

await cli(MIGRATIONS);
