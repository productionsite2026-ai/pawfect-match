export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const noopStorage: StorageLike = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export function getSafeLocalStorage(): StorageLike {
  try {
    if (typeof window === "undefined") return noopStorage;
    const storage = window.localStorage;
    // Accessing localStorage can throw in some sandboxed/3rd-party contexts.
    storage.getItem("__storage_test__");
    return storage;
  } catch {
    return noopStorage;
  }
}

export function getSafeSessionStorage(): StorageLike {
  try {
    if (typeof window === "undefined") return noopStorage;
    const storage = window.sessionStorage;
    storage.getItem("__storage_test__");
    return storage;
  } catch {
    return noopStorage;
  }
}
