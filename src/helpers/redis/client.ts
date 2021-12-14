import Redis from "ioredis";

import { env } from "../env";

export const redisClient = new Redis(
  env("REDIS_PORT", 6379),
  env("REDIS_HOST", "localhost"),
  {
    ...(env("REDIS_PASSWORD") && {
      password: env("REDIS_PASSWORD"),
    }),
  }
);
