import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "hono/bun";
import { WebhookEvent } from "@line/bot-sdk";
import { textEventHandler } from "./modules/handler";
import { getParams } from "./modules/kintoneFunc";


const portString = process.env.PORT;
const port = portString ? parseInt(portString) : 3000;

const app = new Hono();

app.use("/favicon.ico", serveStatic({ path: "./public/favicon.ico" }));
app.get("/", (c) => {
  return c.json({ message: "Hello LINE Bot!" });
});
app.post("/webhook", async (c) => {
  const data = await c.req.json();
  const events: WebhookEvent[] = (data as any).events;
  await Promise.all(
    events.map(async (event: WebhookEvent) => {
      try {
        await textEventHandler(event);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err);
        }
        return c.json({
          status: "error",
        });
      }
    })
  );
  return c.json({ message: "ok" });
});

app.get('/api/v1/*', cors())

app.get("/api/v1/:lineId", async (c) => {
  const userId = c.req.param('lineId');
  const params = await getParams(userId);
  return c.json(params);
})

console.log(`Running at http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
};