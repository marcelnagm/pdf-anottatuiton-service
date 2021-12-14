import { redisClient } from "./client";

redisClient.on("connect", () => {
  console.log("REDIS READY");
});

redisClient.on("error", (event) => {
  console.log("REDIS ERROR", event);
});
