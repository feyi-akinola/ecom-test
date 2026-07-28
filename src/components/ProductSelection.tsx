import Step from "./Step";
import { useProductData } from "../../hooks/useProductData";
import type { ProductItem } from "../../api/schema";
import { useEffect, useRef, useState } from "react";

export interface Category {
  title: string;
  nextText: string | null;
  icon: string;
  products: ProductItem[];
};

const ProductSelection = () => {
  const {data, error} = useProductData();
  const [openStepIndex, setOpenStepIndex] = useState<number>(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (openStepIndex < 1) return;

    stepRefs.current[openStepIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [openStepIndex]);

  if (error) {
    return (
      <div></div>
    );
  }

  if (!data) return (
    <div className="max-w-3xl flex flex-col gap-6">
      {
        Array.from({ length: 4}).map((_, index) =>
          <div
            key={index}
            className="w-full h-26 bg-gray-200 rounded-xl animate-pulse">
          </div>
        )
      }
    </div>
  );

  const categories: Category[] = [
    {
      title: "Choose your cameras",
      nextText: "Choose your plan",
      icon: "src/assets/svg/camera.svg",
      products: data.cameras,
    },
    {
      title: "Choose your plan",
      nextText: "Choose your sensors",
      icon: "src/assets/svg/plan.svg",
      products: data.plans,
    },
    {
      title: "Choose your sensors",
      nextText: "Add extra protection",
      icon: "src/assets/svg/sensor.svg",
      products: data.sensors,
    },
    {
      title: "Add extra protection",
      nextText: null,
      icon: "src/assets/svg/protection.svg",
      products: data.protection,
    },
  ];
  
  return (
    <div className="w-full max-w-190 flex flex-col">
      <h1 className="text-2xl font-bold text-alt pt-xl pb-3xl text-center
        block md:hidden">
        Let's Get Started!
      </h1>

      <div className="flex flex-col md:gap-xs-2">
        {
          categories.map((category, index) =>
            <Step
              key={index}
              ref={(el) => { stepRefs.current[index] = el; }}
              category={category}
              index={index}
              isOpen={openStepIndex === index}
              onToggle={() => setOpenStepIndex((prev) => (prev === index ? -1 : index))}
              onNext={() => setOpenStepIndex(index + 1)}/>
          )
        }
      </div>
    </div>
  );
};

export default ProductSelection;