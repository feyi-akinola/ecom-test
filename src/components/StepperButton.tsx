interface StepperButtonProps {
  icon: string;
  disabled: boolean;
  ariaLabel: string;
  onClick: () => void;
}

const StepperButton = ({
  icon,
  disabled,
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
        ${disabled ? "border-sm border-icon-bg" : "bg-icon-bg cursor-pointer"}`}
    >
      <img
        src={icon}
        alt={"Stepper button"}
        className={`size-2xs ${disabled && "opacity-30"}`}/>
    </button>
  );
};

export default StepperButton;