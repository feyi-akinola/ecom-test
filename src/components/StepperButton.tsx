interface StepperButtonProps {
  icon: string;
  disabled: boolean;
  light?: boolean;
  ariaLabel: string;
  onClick: () => void;
}

const StepperButton = ({
  icon,
  disabled,
  light = false,
  ariaLabel,
  onClick,
}: StepperButtonProps) => {
  return (
    <button
      type="button"
      onClick={!disabled ? onClick : undefined}
      aria-label={ariaLabel}
      disabled={disabled}
      className={`flex size-sm-2 items-center justify-center rounded-sm
        transition-coloirs duration-200 ${!disabled && "hover:bg-accent-light"}
        ${disabled ? "border-sm border-icon-bg" : light ? "bg-white cursor-pointer" : "bg-icon-bg cursor-pointer"}`}
    >
      <img
        src={icon}
        alt={"Stepper button"}
        className={`size-2xs ${disabled && "opacity-30"}`}/>
    </button>
  );
};

export default StepperButton;