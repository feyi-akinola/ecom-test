import type { ReactNode } from "react";

interface AnimatedElementProps {
  children: ReactNode;
  index: number;
  delay?: number;
  className?: string;
}

const AnimatedElement = ({
  children,
  index,
  delay,
  className,
} : AnimatedElementProps) => {
  return (
    <div
      className={`animate-fade-in-up ${className}`}
      style={{
        animationDelay: `${(index * 60) + ((delay ?? 80))}ms`,
        animationFillMode: "backwards"
      }}>
      {children}
    </div>
  );
};

export default AnimatedElement;