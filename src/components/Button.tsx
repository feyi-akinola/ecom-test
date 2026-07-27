interface ButtonProps {
  text: string;
  onClick: () => void;
}

const Button = ({text, onClick} : ButtonProps) => {
  return (
    <div
      className="flex w-full h-lg-2 rounded-md border text-white
        cursor-pointer items-center bg-main justify-center
        hover:opacity-90 transition-opacity duration-200"
      onClick={onClick}>
      <p className="w-full text-md-2 leading-track traking-none font-bold
        text-center">
        {text}
      </p>
    </div>
  );
};

export default Button;