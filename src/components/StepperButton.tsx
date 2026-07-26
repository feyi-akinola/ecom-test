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
      className="flex h-5 w-5 items-center justify-center rounded-sm
        bg-(--icon-bg) border-gray-200 disabled:opacity-40 cursor-pointer"
    >
      <img
        src={icon}
        alt={"Stepper button"}
        className="stroke-red-500"/>
    </button>
  );
};

export default StepperButton;