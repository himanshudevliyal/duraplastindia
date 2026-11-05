// npm run seed | seed:down | seed:status
// Files: server/seeders/*.js (run in name order, each only once).
import { SEEDS, cli } from "./lib/runner.js";

await cli(SEEDS);
