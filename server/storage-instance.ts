import { DbStorage } from "./db-storage.js";
import { MemStorage, type IStorage } from "./storage.js";

let storage: IStorage;

export function getStorage(): IStorage {
  if (!storage) {
    if (process.env.NODE_ENV === "production") {
      storage = new DbStorage();
    } else {
      storage = new MemStorage();
    }
  }
  return storage;
}