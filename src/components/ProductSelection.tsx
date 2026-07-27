import Step from "./Step";
import { useProductData } from "../../hooks/useProductData";
import type { ProductItem } from "../../api/schema";

export interface Category {
  title: string;
  nextText: string | null;
  icon: string;
  products: ProductItem[];
};

const ProductSelection = () => {
  const {data, error} = useProductData();

  if (error) {
    return (
      <div></div>
    );
  }

  if (!data) return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
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
    <div className="max-w-190 mx-auto flex flex-col gap-md-2">
      {
        categories.map((category, index) =>
          <Step key={index} category={category} index={index}/>
        )
      }
    </div>
  );
};

export default ProductSelection;