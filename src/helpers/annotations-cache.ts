import { getFromCache, setInCache, deleteFromCache, parseToArray } from ".";

export const getAnnotationsFromCache = async (
  key: string
): Promise<{ annotations: [] }> => {
  const response = await getFromCache(key);

  return response || { annotations: [] };
};
