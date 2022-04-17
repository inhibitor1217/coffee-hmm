import { SessionStorage } from "../constants/common/webStorage";

type SessionStorage = typeof SessionStorage[keyof typeof SessionStorage];

export function setSessionStorage(
  key: SessionStorage,
  value: string | boolean,
) {
  const storedData = JSON.stringify(value);

  return sessionStorage.setItem(key, storedData);
}

export function getSessionStorage(key: SessionStorage) {
  const storedDataStr = sessionStorage.getItem(key);

  if (!storedDataStr) return null;

  return JSON.parse(storedDataStr);
}

export function deleteSessionStorage(key: SessionStorage) {
  return sessionStorage.removeItem(key);
}
