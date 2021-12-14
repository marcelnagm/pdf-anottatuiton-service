import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } from "../config";

export const redisConfig = {
  redis: {
    host: REDIS_HOST,
    ...(REDIS_PASSWORD && { password: REDIS_PASSWORD }),
    port: REDIS_PORT,
  },
};
