import ProductSelection from "./components/ProductSelection.tsx";
import ReviewPanel from "./components/ReviewPanel.tsx";

export default function App() {
  return (
    <div className="w-full font-gilroy tracking-none leading-compact
      flex flex-col lg:flex-row md:gap-2xl-3 justify-center items-center
      lg:items-start md:my-4xl">
      <ProductSelection />
      <ReviewPanel />
    </div>
  );
};
