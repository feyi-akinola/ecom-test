import type { ProductItem } from "../../api/schema";
import StepperButton from "./StepperButton";
import {
  useCartStore,
  useSelectedOption,
  useProductQuantity,
  useProductHasSelection
} from "../../store/useCartStore";

export interface ProductCardProps {
  product: ProductItem;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const selectedOption = useSelectedOption(product);
  const quantity = useProductQuantity(product);
  const selectOption = useCartStore((state) => state.selectOption);
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);

  const {
    id,
    name,
    description,
    options,
    price,
    discountedPrice,
    image
  } = product;

  const hasSelection = useProductHasSelection(product);
  
  const hasDiscount =
    typeof discountedPrice === "number" && discountedPrice < price;
  const discountPct = hasDiscount
    ? Math.round(((price - (discountedPrice as number)) / price) * 100)
    : null;

  const formatPrice =
    (value: number) => (value === 0 ? "FREE" : `$${value.toFixed(2)}`);

  const isCamUnlimitedPlan = name == "Cam Unlimited";

  return (
    <div className={`relative flex md:flex-col lg:flex-row gap-4 rounded-lg
      bg-white p-sm-4 h-full tracking-sm items-center
      border-sm ${hasSelection ? "border-accent" : "border-white"}`}>
      {/* Discount */}
      {
        hasDiscount && (
          <span className="absolute rounded-lg bg-main top-sm-4 left-sm-4
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
            className="w-2xl md:w-auto md:h-2xl lg:w-2xl shrink-0 rounded-lg
              object-contain"
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
            {
              isCamUnlimitedPlan ? (
                <h3 className="text-md text-alt font-bold">
                  Cam <span className="text-main">Unlimited</span>
                </h3>
              ) : (
                <h3 className="text-md text-alt font-semibold">
                  {name}
                </h3>
              )
            }
            
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
            options && (
              <div className="flex flex-wrap gap-xs">
                {
                  options.map((option) => {
                    const isSelected = selectedOption === option.id;
                    const isOnlyOption = options.length === 1;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        disabled={isOnlyOption}
                        onClick={() => selectOption(id, option.id)}
                        className={`flex rounded-sm border-xs px-xs py-xs-5 items-center
                          relative hover:bg-icon-bg transition-colors duration-200
                          ${isOnlyOption ? "cursor-default" : "cursor-pointer"}
                          ${isSelected
                            ? "border-green bg-green-light"
                            :  "border-border-light"
                          }`}>
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
                    );
                  })
                }
              </div>
            )
          }
        </div>

        <div className="flex flex-row items-center justify-between">
          {/* Quantity stepper */}
          <div className="w-xl flex items-center p-[7.5px] justify-between">
            <StepperButton
              onClick={() => decrement(product)}
              ariaLabel={`Reduce quantity of ${name}`}
              icon="src/assets/svg/remove.svg"
              disabled={quantity === 0 || product.required}/>
            <span className="text-center text-md font-medium tracking-none">
              {quantity}
            </span>
            <StepperButton
              onClick={() => increment(product)}
              ariaLabel={`Increase quantity of ${name}`}
              icon="src/assets/svg/add.svg"
              disabled={product.required}/>
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