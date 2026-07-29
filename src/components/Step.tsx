import type { Category } from "./ProductSelection";
import ProductCard from "./ProductCard";
import NextButton from "./NextButton";
import { useCartStore, getCartKey } from "../../store/useCartStore";
import { forwardRef } from "react";
import AnimatedElement from "./AnimatedElement";

type StepProps = {
  category: Category;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  onNext: () => void;
}

const Step = forwardRef<HTMLDivElement, StepProps>(({
  category: { icon, nextText, title, products },
  index,
  isOpen,
  onToggle,
  onNext,
}, ref) => {
  const selectedCount = useCartStore((state) =>
    products.reduce((count, product) => {
      const hasQuantity = product.options && product.options.length > 0
        ? product.options.some(
            (option) => (state.quantities[getCartKey(product.id, option.id)] ?? 0) > 0
          )
        : (state.quantities[getCartKey(product.id, null)] ?? 0) > 0;
  
      return count + (hasQuantity ? 1 : 0);
    }, 0)
  );

  return (
    <div
      ref={ref}
      className={`flex flex-col md:rounded-lg ${isOpen && "bg-category-bg"}`}>
      {/* Step count */}
      <p className="text-xs uppercase px-md-4 py-xs-2 md:pt-sm text-grey-alt
        tracking-md font-medium leading-compact">
        Step {index + 1} of 4
      </p>

      {/* Icon, title & menu toggle */}
      <div
        className={`flex items-center justify-between border-t-xs
          cursor-pointer border-alt px-md-4 py-xl
          ${!isOpen && "border-b-xs"}`}
        onClick={onToggle}>
        <div className="flex items-center gap-sm">
          <img src={icon} alt="Menu toggle" className="size-md"/>
          <div className="leading-compact text-md-3 md:text-lg text-alt font-semibold">
            {title}
          </div>
        </div>

        <div className="flex items-center gap-xs-3">
          {
            isOpen && selectedCount > 0 && (
              <p className="font-medium text-main text-sm-2">
                {selectedCount} selected
              </p>
            )
          }
          <img 
            src="src/assets/svg/menu-toggle.svg" 
            alt="Menu toggle"
            className={`size-xs ${isOpen && "rotate-180"}`}/>
        </div>
      </div>
      
      <div
        className={`${!isOpen && "hidden"} flex flex-col items-center
        gap-md pb-xl`}>
        {/* Products */}
        <div
          className="w-full flex flex-wrap justify-center px-md-4 gap-md-4">
          {products.map((p, pIndex) => (
            <AnimatedElement
              key={p.id}
              index={pIndex}
              className="w-full
                sm:w-[calc((100%-var(--gap-md-4,1rem))/2)]
                md:w-[calc((100%-2*var(--gap-md-4,1rem))/3)]
                lg:w-[calc((100%-var(--gap-md-4,1rem))/2)]">
              <ProductCard product={p} />
            </AnimatedElement>
          ))}
        </div>

        {/* Next button */}
        {
          nextText && <NextButton text={nextText} onClick={onNext}/>
        }
      </div>
    </div>
  );
});

export default Step;