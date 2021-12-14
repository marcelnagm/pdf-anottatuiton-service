import { redisClient } from "./client";

export const setInCache = (key: string, value: any) =>
  redisClient.set(key, JSON.stringify(value));

export const getFromCache = async (key: string) => {
  const response = await redisClient.get(key);

  return JSON.parse(response);
};

export const deleteFromCache = (key: string) => redisClient.del(key);
