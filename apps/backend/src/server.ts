import { createApp } from "./app.js";

const app = createApp();
const port = Number(process.env.PORT ?? 4010);
const host = process.env.HOST ?? "127.0.0.1";

try {
  await app.listen({ host, port });
  app.log.info(`Backend API is listening on http://${host}:${port}`);
} catch (error) {
  app.log.error(error instanceof Error ? error : { error });
  process.exit(1);
}
