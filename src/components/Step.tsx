import { useState } from "react";
import type { Category } from "./ProductSelection";
import ProductCard from "./ProductCard";
import NextButton from "./NextButton";
import { useCartStore, getCartKey } from "../../store/useCartStore";

type StepProps = {
  category: Category;
  index: number;
}

const Step = ({
  category: { icon, nextText, title, products },
  index
} : StepProps) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(index == 0);

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

  const handleMenuToggle = () => {
    setMenuOpen((prev) => !prev);
  }

  const handleNextClick = () => {}

  return (
    <div
      className={`flex flex-col md:rounded-lg ${menuOpen && "bg-category-bg"}`}>
      {/* Step count */}
      <p className="step-count leading-compact">Step {index + 1} of 4</p>

      {/* Icon, title & menu toggle */}
      <div
        className={`flex items-center justify-between border-t-xs
          cursor-pointer border-alt px-md-4 py-xl
          ${!menuOpen && "border-b-xs"}`}
        onClick={handleMenuToggle}>
        <div className="flex items-center gap-sm">
          <img src={icon} alt="Menu toggle" className="size-md"/>
          <div className="title">{title}</div>
        </div>

        <div className="flex items-center gap-xs-3">
          {
            menuOpen && selectedCount > 0 && (
              <p className="font-medium text-main text-sm-2">
                {selectedCount} selected
              </p>
            )
          }
          <img 
            src="src/assets/svg/menu-toggle.svg" 
            alt="Menu toggle"
            className={`size-xs ${menuOpen && "rotate-180"}`}/>
        </div>
      </div>
      
      {/* Products */}
      <div
        className={`${!menuOpen && "hidden"} flex flex-col items-center
          gap-md pb-xl`}>
        <div
          className="flex flex-wrap justify-center px-md-4"
          style={{ gap: "var(--gap-md-4, 1rem)" }}>
          {products.map((p) => (
            <div
              key={p.id}
              className="w-full
                sm:w-[calc((100%-var(--gap-md-4,1rem))/2)]
                md:w-[calc((100%-2*var(--gap-md-4,1rem))/3)]
                lg:w-[calc((100%-var(--gap-md-4,1rem))/2)]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>

        {/* Next button */}
        {
          nextText && <NextButton text={nextText} onClick={handleNextClick}/>
        }
      </div>
    </div>
  );
};

export default Step;