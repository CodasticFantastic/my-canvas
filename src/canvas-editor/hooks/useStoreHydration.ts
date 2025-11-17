import { useEffect, useState } from "react";
import { canvasStoreApi } from "../store/canvas-editor.store";

export function useStoreHydration() {
  const [isStoreHydrated, setIsStoreHydrated] = useState(false);

  useEffect(() => {
    type StoreWithPersist = {
      persist?: {
        hasHydrated: () => boolean;
        onFinishHydration: (cb: () => void) => () => void;
      };
    };

    const storeApi = canvasStoreApi as unknown as StoreWithPersist;

    const setHydrated = () => {
      setIsStoreHydrated(true);
    };

    if (!storeApi?.persist) {
      setTimeout(setHydrated, 50);
      return;
    }

    const persistApi = storeApi.persist;

    const checkHydration = () => {
      try {
        if (persistApi.hasHydrated()) {
          setHydrated();
          return true;
        }
      } catch {
        setHydrated();
        return true;
      }
      return false;
    };

    const immediateCheck = setTimeout(() => {
      checkHydration();
    }, 0);

    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = persistApi.onFinishHydration(setHydrated);
    } catch {
      setHydrated();
    }

    const fallbackTimeout = setTimeout(() => {
      if (!checkHydration()) {
        setHydrated();
      }
    }, 500);

    return () => {
      clearTimeout(immediateCheck);
      clearTimeout(fallbackTimeout);
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return isStoreHydrated;
}
