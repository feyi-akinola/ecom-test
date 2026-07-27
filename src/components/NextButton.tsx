interface NextButtonProps {
  text: string;
  onClick: () => void;
}

const NextButton = ({text, onClick} : NextButtonProps) => {
  return (
    <div
      className="flex px-2xl h-lg-2 rounded-md border text-main
        border-main hover:text-white cursor-pointer items-center
        justify-center hover:bg-main transition-colors duration-200"
      onClick={onClick}>
      <p className="text-md-3 leading-track traking-none font-semibold">
        Next: {text}
      </p>
    </div>
  );
};

export default NextButton;