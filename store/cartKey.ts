const NO_OPTION = "no-option";

export const getCartKey = (productId: string, optionId: string | null) =>
  `${productId}::${optionId ?? NO_OPTION}`;