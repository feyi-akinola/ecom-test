import Step from "./components/Step";

const steps = [
  {
    title: "Choose your cameras",
    icon: "src/assets/svg/camera.svg"
  },
  {
    title: "Choose your plan",
    icon: "src/assets/svg/plan.svg"
  },
  {
    title: "Choose your sensors",
    icon: "src/assets/svg/sensor.svg"
  },
  {
    title: "Add exta protection",
    icon: "src/assets/svg/protection.svg"
  },
];

export default function App() {
  return (
    <div className="w-screen py-40">
      <div className="w-200 mx-auto flex flex-col gap-2">
        {
          steps.map((step, index) =>
            <Step key={index} step={step} index={index}/>
          )
        }
      </div>
    </div>
  );
};
