import { env } from "./config/env.js";
import { createApp } from "./app.js";
import { loadDb } from "./data/store.js";

async function bootstrap() {
  await loadDb();

  const app = createApp();
  app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`TaxCollect backend listening on http://localhost:${env.PORT}`);
  });
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start backend", err);
  process.exit(1);
});
