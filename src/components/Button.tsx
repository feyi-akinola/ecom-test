interface ButtonProps {
  text: string;
  onClick: () => void;
}

const Button = ({text, onClick} : ButtonProps) => {
  return (
    <div
      className="px-4 py-2 rounded-lg font-semibold border
      text-(--main) border-(--main) hover:text-(--bg)
      hover:bg-(--main) cursor-pointer transition-colors
      duration-200"
      onClick={onClick}>
      Next: {text}
    </div>
  );
};

export default Button;