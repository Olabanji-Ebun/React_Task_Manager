import type { Task } from '../types/database';

const DB_NAME = 'TaskManagerDB';
const STORE_NAME = 'tasks';
const DB_VERSION = 1;

let db: IDBDatabase | null = null;

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

export const getAllTasks = async (): Promise<Task[]> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const tasks = request.result as Task[];
      resolve(tasks.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ));
    };
  });
};

export const addTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> => {
  const database = await initDB();
  const newTask: Task = {
    ...(task as any),
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(newTask);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(newTask);
  });
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
  const database = await initDB();
  return new Promise(async (resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const getRequest = store.get(id);

    getRequest.onerror = () => reject(getRequest.error);
    getRequest.onsuccess = () => {
      const existingTask = getRequest.result as Task;
      const updatedTask: Task = {
        ...existingTask,
        ...updates,
        id,
        updated_at: new Date().toISOString(),
      };

      const putRequest = store.put(updatedTask);
      putRequest.onerror = () => reject(putRequest.error);
      putRequest.onsuccess = () => resolve(updatedTask);
    };
  });
};

export const deleteTask = async (id: string): Promise<void> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};
