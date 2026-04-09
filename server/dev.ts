import { app } from "./index.js";
import { setupVite, log } from "./vite.js";
import { seedDatabase } from "./seed.js";
import { createServer } from "http";

(async () => {
  await seedDatabase();

  const server = createServer(app);
  await setupVite(app, server);

  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({ port, host: "0.0.0.0" }, () => {
    log(`serving on port ${port}`);
  });
})().catch((err) => {
  console.error("Failed to start dev server:", err);
  process.exit(1);
});
