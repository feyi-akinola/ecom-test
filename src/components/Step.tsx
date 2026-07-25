import { useState } from "react";

type StepProps = {
  step: {
    icon: string;
    title: string;
  };
  index: number;
}

const Step = ({step: {icon, title}, index} : StepProps) => {
  const [menuOpen, setmenuOpen] = useState<boolean>(index == 0);

  const handleMenuToggle = () => {
    setmenuOpen((prev) => !prev);
  }

  return (
    <div
      className="flex flex-col rounded-xl"
      style={{
        backgroundColor: menuOpen && "var(--section-bg)"
      }}>
      {/* Step count */}
      <p className="step-count">Step {index + 1} of 4</p>

      {/* Title & menu toggle */}
      <div className="flex items-center justify-between border-t-[0.5px] border-(--text-alt) p-4">
        <div className="flex gap-2 items-center">
          <img src={icon} alt="Menu toggle" className=""/>
          <div className="title">{title}</div>
        </div>

        <div className="menu">
          <img 
            src="src/assets/svg/menu-toggle.svg" 
            alt="Menu toggle"
            className="cursor-pointer"
            style={{
              rotate: !menuOpen && "180deg"
            }}
            onClick={handleMenuToggle} />
        </div>
      </div>
    </div>
  );
};

export default Step;