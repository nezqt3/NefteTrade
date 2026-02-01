import { redis } from "config/redis";
import { sendWelcomeEmail } from "./notifications.mail";

async function start() {
  let lastId = "$";

  while (true) {
    const events = await redis.xread("BLOCK", 0, "STREAMS", "events", lastId);

    for (const [, messages] of events) {
      for (const [id, data] of messages) {
        lastId = id;

        const type = data[1];
        const payload = JSON.parse(data[3]);

        if (type === "USER_REGISTERED") {
          await sendWelcomeEmail(payload);
        }
      }
    }
  }
}

start();
