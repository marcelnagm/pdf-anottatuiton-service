import { redisClient } from "./client";

export const setInCache = (key: string, value: any) =>{
  const ttl = 432000

  redisClient.set(key, JSON.stringify(value), "EX", ttl);
}

export const getFromCache = async (key: string) => {
  const response = await redisClient.get(key);

  return JSON.parse(response);
};

export const deleteFromCache = (key: string) => redisClient.del(key);
