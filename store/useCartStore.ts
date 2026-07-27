import { create } from "zustand";
import type { ProductItem } from "../api/schema";

const NO_OPTION = "no-option";

export const getCartKey = (productId: string, optionId: string | null) =>
  `${productId}::${optionId ?? NO_OPTION}`;

export const getDefaultOption = (options: ProductItem["options"]): string | null =>
  options && options.length === 1 ? options[0].id : null;

interface CartState {
  quantities: Record<string, number>;
  selectedOptions: Record<string, string | null>;

  selectOption: (productId: string, optionId: string) => void;
  increment: (product: ProductItem) => void;
  decrement: (product: ProductItem) => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  quantities: {},
  selectedOptions: {},

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