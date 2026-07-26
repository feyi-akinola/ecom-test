import { useEffect, useState } from "react";
import { getProductData } from "../api/getProductData";
import type { DataObject } from "../api/schema";

export function useProductData() {
  const [data, setData] = useState<DataObject | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProductData()
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load product data"));
  }, []);

  return { data, error };
}