import { getFromCache, setInCache, deleteFromCache, parseToArray } from ".";

export interface ResponseCache {
  annotations: [{ id: string; annotation: string }];
  created_at: string;
}

export const getAnnotationsFromCache = async (
  key: string
): Promise<ResponseCache> => {
  const response = await getFromCache(key);

  return response || { annotations: [] };
};
