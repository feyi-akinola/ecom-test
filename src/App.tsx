import ProductSelection from "./components/ProductSelection.tsx";
import ReviewPanel from "./components/ReviewPanel.tsx";

export default function App() {
  return (
    <div className="w-full py-40 font-gilroy tracking-none leading-compact
      flex flex-col xl:flex-row gap-2xl-3 justify-center items-center">
      <ProductSelection />
      <ReviewPanel />
    </div>
  );
};
