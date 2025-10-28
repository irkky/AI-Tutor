import { MemStorage } from './storage';

// Singleton storage instance for serverless functions
// This will persist across invocations within the same instance
let storageInstance: MemStorage | null = null;

export function getStorage(): MemStorage {
  if (!storageInstance) {
    storageInstance = new MemStorage();
  }
  return storageInstance;
}
