import { useProductData } from "../../hooks/useProductData";
import type { ProductItem } from "../../api/schema";
import { useCartStore, getCartKey } from "../../store/useCartStore";
import StepperButton from "./StepperButton";
import Button from "./Button";
import ConfirmationModal from "./ConfirmationModal";
import { useState } from "react";

type SaveState = "IDLE" | "SAVED" | "ERROR";

interface ReviewPanelSection {
  label: string;
  products: ProductItem[];
}

interface LineItem {
  product: ProductItem;
  optionId: string | null;
  optionName: string | null;
  optionImage: string | null;
  quantity: number;
}

const formatPrice = (value: number) => (value === 0 ? "FREE" : `$${value.toFixed(2)}`);

const ReviewPanel = () => {
  const { data, error } = useProductData();
  const saveForLater = useCartStore((state) => state.saveForLater);
  const [saveStatus, setSaveStatus] = useState<SaveState>("IDLE");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const quantities = useCartStore((state) => state.quantities);
  const incrementByKey = useCartStore((state) => state.incrementByKey);
  const decrementByKey = useCartStore((state) => state.decrementByKey);

  if (error) return <div></div>;
  if (!data) {
    return <div className="w-full max-w-md rounded-xl bg-section-bg h-96 animate-pulse" />;
  }
  const sections: ReviewPanelSection[] = [
    { label: "Cameras", products: data.cameras },
    { label: "Sensors", products: data.sensors },
    { label: "Accessories", products: data.protection },
    { label: "Plan", products: data.plans },
  ];

  const getLineItems = (products: ProductItem[]): LineItem[] => {
    const lines: LineItem[] = [];
    for (const product of products) {
      if (!product.options || product.options.length === 0) {
        const qty = quantities[getCartKey(product.id, null)] ?? 0;
        if (qty > 0) {
          lines.push({ product, optionId: null, optionName: null, optionImage: null, quantity: qty });
        }
        continue;
      }
      for (const option of product.options) {
        const qty = quantities[getCartKey(product.id, option.id)] ?? 0;
        if (qty > 0) {
          lines.push({
            product,
            optionId: option.id,
            optionName: option.name,
            optionImage: option.image ?? null,
            quantity: qty,
          });
        }
      }
    }
    return lines;
  };

  const allLines = sections.flatMap((section) => getLineItems(section.products));
  
  const isCartEmpty = allLines.length === 0;
  
  const subtotal = allLines.reduce((sum, line) => {
    const unitPrice = line.product.discountedPrice ?? line.product.price;
    return sum + unitPrice * line.quantity;
  }, 0);

  const originalSubtotal = allLines.reduce(
    (sum, line) => sum + line.product.price * line.quantity,
    0
  );

  const SAVE_STATUS_CONFIG: Record<SaveState, {label: string, style: string}> = {
    IDLE: {
      label: "Save my system for later",
      style: "text-grey",
    },
    SAVED: {
      label: "Saved! Come back anytime.",
      style: "text-green",
    },
    ERROR: {
      label: "Couldn't save — try again",
      style: "text-red",
    },
  } as const; // Label and styles for "Save for later" button 
  const { label: saveLabel, style: saveStyle } =
    SAVE_STATUS_CONFIG[saveStatus] || SAVE_STATUS_CONFIG.IDLE;

  const savings = originalSubtotal - subtotal;

  const handleSaveCart = () => {
    const success = saveForLater();
    setSaveStatus(success ? "SAVED" : "ERROR");

    setTimeout(() => setSaveStatus("IDLE"), 3000); // Resets message
  }

  return (
    <div className="w-full lg:w-3xl max-w-190 h-full md:rounded-lg bg-category-bg flex
      min-w-93 flex-col">
      <p className="text-sm font-medium tracking-md text-grey-alt uppercase
        leading-compact p-md-4 pb-xs-2">
        Review
      </p>

      <div className="flex flex-col p-xl gap-sm-3">
        {/* Header */}
        <div className="flex flex-col gap-xs-2">
          <h2 className="text-lg font-semibold text-alt leading-compact">
            Your security system
          </h2>
          <p className="text-sm sm:text-sm-2 font-medium text-grey leading-tall">
            Review your personalized protection system designed to keep what matters most safe.
          </p>
        </div>
        
        {
          sections.map((section) => {
            const lines = getLineItems(section.products);
            if (lines.length === 0) return null;

            return (
              <div
                key={section.label}
                className="flex flex-col gap-sm border-t-xs border-fade-light pt-md-4">
                <p className="text-sm tracking-wide text-fade uppercase">
                  {section.label}
                </p>

                {lines.map((line) => {
                  const { product, optionId, optionName, optionImage, quantity } = line;

                  const unitPrice = product.discountedPrice ?? product.price;
                  const lineTotal = unitPrice * quantity;
                  const originalLineTotal = product.price * quantity;

                  const hasDiscount =
                    typeof product.discountedPrice === "number" &&
                    product.discountedPrice < product.price;

                  const isCamUnlimitedPlan = product.name === "Cam Unlimited";

                  return (
                    <div 
                      key={getCartKey(product.id, optionId)}
                      className="flex justify-between">
                      {/* Image and name */}
                      <div className={`flex items-center ${isCamUnlimitedPlan ? "gap-xs-4" : "gap-md"}`}>
                        <img
                          src={product.image ?? ""}
                          alt={product.name}
                          className={
                            isCamUnlimitedPlan ? "w-sm-2"
                            : "size-lg-2 shrink-0 rounded-sm-2 object-contain"}
                        />

                        <div className="flex flex-1 flex-col gap-xs-5">
                          {
                            isCamUnlimitedPlan ? (
                              <p className="text-md text-black font-bold leading-compact tracking-hug-3">
                                Cam <span className="text-main">Unlimited</span>
                              </p>
                            ) : (
                              <p className="text-alt w-2xl-2 font-medium tracking-sm-rel-2
                                leading-short text-sm sm:text-sm-2">
                                {product.name}
                              </p>
                            )
                          }
                          {
                            optionName && (
                              <p className="text-xs font-medium text-fade-dark">
                                {optionName}
                              </p>
                            )
                          }
                        </div>
                      </div>

                      <div className="flex gap-md items-center">
                        {/* Stepper */}
                        {
                          !product.noIncrement && (
                            <div className="flex justify-between w-lg-3">
                              <StepperButton
                                onClick={() => decrementByKey(product.id, optionId)}
                                ariaLabel={`Reduce quantity of ${product.name}`}
                                icon="src/assets/svg/remove.svg"
                                disabled={product.required}
                                light
                              />
                              <span className="text-center text-sm sm:text-sm-2 font-medium
                                tracking-none">
                                {quantity}
                              </span>
                              
                              <StepperButton
                                onClick={() => incrementByKey(product.id, optionId)}
                                ariaLabel={`Increase quantity of ${product.name}`}
                                icon="src/assets/svg/add.svg"
                                disabled={product.required}
                                light
                              />
                            </div>
                          )
                        }

                        {/* Price */}
                        <div className="flex flex-col items-end text-sm sm:text-sm-2
                          leading-short tracking-sm-rel-2">
                          {hasDiscount && (
                            <span className="text-fade-dark line-through">
                              ${originalLineTotal.toFixed(2)}
                            </span>
                          )}
                          <span className={`font-semibold ${lineTotal === 0 ? "text-green" : "text-main"}`}>
                            {formatPrice(lineTotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })
        }

        { /* Fast Shipping */ }
        <div className="flex items-center gap-sm-4 border-t-xs border-fade-light pt-md">
          <div className="size-lg-2 shrink-0 rounded-lg bg-white flex items-center justify-center">
            <img
              src="src/assets/svg/shipping.svg"
              alt="Fast Shipping"
              className="w-md-2" />
          </div>
          <p className="flex-1 text-sm-2 text-dark font-medium">
            Fast Shipping
          </p>
          <div className="flex flex-col items-end gap-xs-4 text-sm-2">
            <span className="text-fade-dark line-through">
              $5.99
            </span>
            <span className="font-semibold text-green">
              FREE
            </span>
          </div>
        </div>

        {/* Satisfaction & total*/}
        <div className="flex items-end justify-between gap-md">
          <img
            src={"/images/guarantee.png"}
            alt={"Satisfaction Badge "}
            className="size-lg-4 shrink-0 object-contain"
          />

          <div className="flex flex-col items-end gap-xs">
            <span className="rounded-xs-3 bg-main px-sm py-xs-2 text-sm font-medium
              text-white leading-compact tracking-tight">
              as low as $19.19/mo
            </span>

            <div className="flex items-baseline gap-xs">
              <span className="text-md-3 text-fade-dark line-through font-medium
                 tracking-sm-rel leading-short-2">
                ${originalSubtotal.toFixed(2)}
              </span>
              <span className="text-2xl font-bold text-main tracking-hug-2
                leading-track-2">
                ${subtotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Savings, checkout & save cart */}
      <div className="w-full flex flex-col items-center px-md-4">
        {
          savings > 0 && (
            <p className="text-sm font-semibold text-green mb-xs-3">
              Congrats! You're saving ${savings.toFixed(2)} on your security bundle!
            </p>
          )
        }

        <Button
          onClick={() => setIsCheckoutOpen(true)}
          disabled={isCartEmpty}
          text="Checkout"/>

        <button
          type="button"
          onClick={handleSaveCart}
          disabled={saveStatus === "ERROR" || saveStatus === "SAVED"}
          className={`mt-sm mb-3xl text-center underline italic cursor-pointer
            hover:opacity-80 leading-medium text-sm sm:text-sm-2
            transition-opacity duration-200 ${saveStyle}`}>
          {saveLabel}
        </button>
      </div>

      <ConfirmationModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        total={subtotal}
        savings={savings}
      />
    </div>
  );
};

export default ReviewPanel;