import { useState } from "react";
import type { ProductItem } from "../../api/schema";
import StepperButton from "./StepperButton";

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
  },
}: ProductCardProps) => {
  const [localQuantity, setLocalQuantity] = useState<number>(0);

  const hasDiscount =
    typeof discountedPrice === "number" && discountedPrice < price;
  const discountPct = hasDiscount
    ? Math.round(((price - (discountedPrice as number)) / price) * 100)
    : null;

  const formatPrice =
    (value: number) => (value === 0 ? "FREE" : `$${value.toFixed(2)}`);

  return (
    <div className={`relative flex gap-4 rounded-lg bg-white p-sm-4
      ${localQuantity > 0 && "border-sm border-accent"} tracking-sm`}>
      {/* Discount */}
      {
        hasDiscount && (
          <span className="absolute rounded-lg bg-main
            px-xs py-xs-5 text-sm font-semibold text-white tracking-none
            leading-tall text-center">
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
            className="w-2xl shrink-0 rounded-lg object-contain"
          />
        ) : (
          <div className="size-2xl bg-icon-bg rounded-xl flex
            items-center justify-center">
            <img
              src="src/assets/svg/plan.svg"
              alt="Plan"
              className="w-lg-2 shrink-0 rounded-lg object-contain opacity-40"
            />
          </div>
        )
      }

      <div className="flex flex-1 flex-col justify-center gap-sm-3">
        <div className="flex flex-col gap-sm-3">
          {/* Title & description */}
          <div className="flex flex-col gap-sm">
            <h3 className="text-md text-alt font-semibold">
              {name}
            </h3>
            {
              description && (
                <p className="text-sm text-grey font-medium leading-tall">
                  {description}
                  {" "}
                  <span className="text-blue font-medium underline
                    cursor-pointer">
                    Learn More
                  </span>
                </p>
              )
            }
          </div>

          {/* Options */}
          {
            options && options.length > 0 && (
              <div className="flex flex-wrap gap-sm">
                {
                  options.map((option) => (
                    <button
                      key={option.name}
                      type="button"
                      className="flex rounded-xs border-xs px-xs py-xs-5
                        items-center border-border-light cursor-pointer
                        hover:border-green hover:bg-green-light">
                      {
                        option.image && (
                          <img
                            className="size-sm"
                            src={option.image}
                            alt={`Option ${option.name}`} />
                        )
                      }
                      <p className="text-xs text-alt font-medium">
                        {option.name}
                      </p>
                    </button>
                  ))
                }
              </div>
            )
          }
        </div>

        <div className="flex flex-row items-center justify-between">
          {/* Quantity stepper */}
          <div className="w-xl flex items-center p-[7.5px] justify-between">
            <StepperButton
              onClick={() => setLocalQuantity((prev) => prev - 1)}
              ariaLabel={`Reduce quantity of ${name}`}
              icon="src/assets/svg/remove.svg"
              disabled={localQuantity === 0}/>
            <span className="text-center text-md font-medium tracking-none">
              {localQuantity}
            </span>
            <StepperButton
              onClick={() => setLocalQuantity((prev) => prev + 1)}
              ariaLabel={`Increase quantity of ${name}`}
              icon="src/assets/svg/add.svg"
              disabled={false}/>
          </div>

          {/* Price */}
          <div className="flex flex-col text-right gap-xs-4">
            {
              hasDiscount && (
                <span className="text-md text-red line-through">
                  ${price.toFixed(2)}
                </span>
              )
            }
            <span
              className={`text-md ${
                (hasDiscount ? discountedPrice : price) === 0
                  ? "text-green"
                  : "text-grey-light"
              }`}>
              {formatPrice(hasDiscount ? (discountedPrice as number) : price)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;