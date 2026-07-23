"use client";

import { useEffect, useState } from "react";

/** True only after the client has hydrated — avoids SSR/client motion mismatches. */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}
