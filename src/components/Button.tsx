interface ButtonProps {
  text: string;
  disabled?: boolean;
  onClick: () => void;
}

const Button = ({text, disabled = false, onClick} : ButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full h-lg-2 rounded-md border text-white
        items-center justify-center transition-opacity duration-200
        ${disabled ? "bg-fade-dark" : "bg-main hover:opacity-90 cursor-pointer"}`}>
      <p className="w-full text-md-2 leading-track traking-none font-bold
        text-center font-tt-norms-pro">
        {text}
      </p>
    </button>
  );
};

export default Button;