import { useState } from 'react';
import type { ProductItem } from '../../api/schema';

export interface ProductCardProps {
  product: ProductItem;
}

const ProductCard = ({
  product: {
    name,
    description,
    options,
    price,
    discountedPrice,
    image
  }
}: ProductCardProps) => {
  const [localQuantity, setLocalQuantity] = useState<number>(0);

  const hasDiscount =
    typeof discountedPrice === 'number' && discountedPrice < price;
  const discountPct = hasDiscount
    ? Math.round(((price - (discountedPrice as number)) / price) * 100)
    : null;

  const formatPrice =
    (value: number) => (value === 0 ? 'FREE' : `$${value.toFixed(2)}`);

  return (
    <div className="relative flex gap-4 rounded-xl bg-(--bg) p-2.75">
      {/* Discount */}
      {
        hasDiscount && (
          <span className="absolute top-2 left-3 rounded-full bg-(--main) px-2.5
            py-0.5 font-gilroy text-xs font-semibold text-white">
            Save {discountPct}%
          </span>
        )
      }

      {/* Image */}
      {
        image ? (
          <img
            src={image}
            alt={name}
            className="w-25.25 shrink-0 rounded-lg object-contain"
          />
        ) : (
          <div className="w-25.25 h-25.25 bg-(--icon-bg) rounded-xl flex items-center
            justify-center">
            <img
              src="src/assets/svg/plan.svg"
              alt="Plan"
              className="w-10 shrink-0 rounded-lg object-contain opacity-40"
            />
          </div>
        )
      }

      <div className="flex flex-1 flex-col justify-center gap-2.5">
        {/* Title & description */}
        <div className="flex flex-col gap-2">
          <h3 className="font-gilroy text-base font-semibold text-gray-900">
            {name}
          </h3>
          {description && (
            <p className="text-sm text-gray-500">
              {description}
              {" "}
              <span className="text-(--text-blue) font-medium underline
                cursor-pointer">
                Learn More
              </span>
            </p>
          )}

          {/* Options */}
          {options && options.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {options.map((option) => (
                <button
                  key={option}
                  type="button"
                  className="rounded-lg border px-1.5 py-0.75 text-[10px]
                    border-(--icon) text-(--icon)"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-row items-center justify-between">
          {/* Quantity stepper */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLocalQuantity((prev) => prev - 1)}
              disabled={localQuantity === 0}
              aria-label={`Decrease quantity of ${name}`}
              className="flex h-8 w-8 items-center justify-center rounded-md border
                border-gray-200 text-gray-600 disabled:opacity-40"
            >
              −
            </button>
            <span className="w-4 text-center font-gilroy text-sm font-medium">
              {localQuantity}
            </span>
            <button
              type="button"
              onClick={() => setLocalQuantity((prev) => prev + 1)}
              aria-label={`Increase quantity of ${name}`}
              className="flex h-8 w-8 items-center justify-center rounded-md border
                border-gray-200 text-gray-600"
            >
              +
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            {hasDiscount && (
              <span className="block text-sm text-(--text-red) line-through">
                ${price.toFixed(2)}
              </span>
            )}
            <span
              className={`font-gilroy text-base ${
                (hasDiscount ? discountedPrice : price) === 0
                  ? 'text-(--text-green)'
                  : 'text-(--text-grey-light)'
              }`}
            >
              {formatPrice(hasDiscount ? (discountedPrice as number) : price)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;