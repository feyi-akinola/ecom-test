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
      className={`flex flex-col rounded-xl pb-4 ${menuOpen && "bg-(--category-bg)"}`}>
      {/* Step count */}
      <p className="category-count">Step {index + 1} of 4</p>

      {/* Title & menu toggle */}
      <div className="flex items-center justify-between border-t-[0.5px]
        border-(--text-alt) p-4">
        <div className="flex gap-2 items-center">
          <img src={icon} alt="Menu toggle" className="w-6.5 h-6.5"/>
          <div className="title">{title}</div>
        </div>

        <div className="menu">
          <img 
            src="src/assets/svg/menu-toggle.svg" 
            alt="Menu toggle"
            className={`cursor-pointer ${menuOpen && "rotate-180"}`}
            onClick={handleMenuToggle} />
        </div>
      </div>
      
      {/* Products */}
      <div
        className={`${!menuOpen && "hidden"} flex flex-col items-center`}>
        <div
          className="w-full grid grid-cols-1 md:grid-cols-2 gap-2 p-2 pb-4">
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