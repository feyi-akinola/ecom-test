import { create } from "zustand";
import type { ProductItem } from "../api/schema";
import { getCartKey } from "./cartKey";
import { initialQuantities, initialSelectedOptions } from "./seedInitialCart";

export { getCartKey };

const STORAGE_KEY = "wyze-bundle-cart";

interface PersistedCart {
  quantities: Record<string, number>;
  selectedOptions: Record<string, string | null>;
}

function loadPersistedCart(): PersistedCart | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedCart;
  } catch {
    // Inaccessible storage — fall back to the seed
    return null;
  }
}

const persisted = loadPersistedCart();

export const getDefaultOption = (options: ProductItem["options"]): string | null =>
  options && options.length === 1 ? options[0].id : null;

interface CartState {
  quantities: Record<string, number>;
  selectedOptions: Record<string, string | null>;

  selectOption: (productId: string, optionId: string) => void;
  increment: (product: ProductItem) => void;
  decrement: (product: ProductItem) => void;
  incrementByKey: (product: string, optionId: string | null) => void;
  decrementByKey: (product: string, optionId: string | null) => void;
  saveForLater: () => boolean;
}

export const useCartStore = create<CartState>((set, get) => ({
  quantities: persisted?.quantities ?? initialQuantities,
  selectedOptions: persisted?.selectedOptions ?? initialSelectedOptions,

  selectOption: (productId, optionId) => {
    set((state) => ({
      selectedOptions: { ...state.selectedOptions, [productId]: optionId },
    }));
  },

  increment: (product) => {
    const { selectedOptions, quantities } = get();
    const option = selectedOptions[product.id] ?? getDefaultOption(product.options);
    if (product.options && product.options.length > 1 && option === null) return;
    const key = getCartKey(product.id, option);
    set({ quantities: { ...quantities, [key]: (quantities[key] ?? 0) + 1 } });
  },

  decrement: (product) => {
    const { selectedOptions, quantities } = get();
    const option = selectedOptions[product.id] ?? getDefaultOption(product.options);
    const key = getCartKey(product.id, option);
    set({
      quantities: { ...quantities, [key]: Math.max(0, (quantities[key] ?? 0) - 1) },
    });
  },

  incrementByKey: (productId: string, optionId: string | null) => {
    const key = getCartKey(productId, optionId);
    set((state) => ({
      quantities: { ...state.quantities, [key]: (state.quantities[key] ?? 0) + 1 },
    }));
  },

  decrementByKey: (productId: string, optionId: string | null) => {
    const key = getCartKey(productId, optionId);
    set((state) => ({
      quantities: { ...state.quantities, [key]: Math.max(0, (state.quantities[key] ?? 0) - 1) },
    }));
  },

  saveForLater: () => {
    const { quantities, selectedOptions } = get();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ quantities, selectedOptions }));
      return true;
    } catch {
      // Storage disabled/full/private — failure
      return false;
    }
  },
}));

export function useSelectedOption(product: ProductItem) {
  return useCartStore(
    (state) => state.selectedOptions[product.id] ?? getDefaultOption(product.options)
  );
}

export function useProductQuantity(product: ProductItem) {
  return useCartStore((state) => {
    const option = state.selectedOptions[product.id] ?? getDefaultOption(product.options);
    return state.quantities[getCartKey(product.id, option)] ?? 0;
  });
}

export function useOptionQuantity(productId: string, optionId: string) {
  return useCartStore((state) => state.quantities[getCartKey(productId, optionId)] ?? 0);
}

export function useProductHasSelection(product: ProductItem) {
  return useCartStore((state) => {
    if (!product.options || product.options.length === 0) {
      return (state.quantities[getCartKey(product.id, null)] ?? 0) > 0;
    }
    return product.options.some(
      (option) => (state.quantities[getCartKey(product.id, option.id)] ?? 0) > 0
    );
  });
}