import { useState } from "react";
import type { Category } from "./ProductSelection";
import ProductCard from "./ProductCard";
import Button from "./Button";

type StepProps = {
  category: Category;
  index: number;
}

const Step = ({
  category: { icon, nextText, title, products },
  index
} : StepProps) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(index == 0);

  const handleMenuToggle = () => {
    setMenuOpen((prev) => !prev);
  }

  const handleNextClick = () => {}

  return (
    <div
      className={`flex flex-col rounded-lg ${menuOpen && "bg-category-bg"}`}>
      {/* Step count */}
      <p className="step-count leading-full">Step {index + 1} of 4</p>

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

        <div className="menu">
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
          className="w-full grid grid-cols-1 md:grid-cols-2
            px-md-4 gap-md-4
            [&>*:last-child:nth-child(odd)]:md:col-span-2
            [&>*:last-child:nth-child(odd)]:md:justify-self-center
            [&>*:last-child:nth-child(odd)]:md:w-1/2">
          {
            products.map((p, index) =>
              <ProductCard key={index} product={p} />
            )
          }
        </div>

        {/* Next button */}
        {
          nextText && <Button text={nextText} onClick={handleNextClick}/>
        }
      </div>
    </div>
  );
};

export default Step;