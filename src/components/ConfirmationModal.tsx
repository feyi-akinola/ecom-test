import { useEffect, useRef } from "react";
import Button from "./Button";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  savings: number;
}

const CheckoutModal = ({ isOpen, onClose, total, savings }: CheckoutModalProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close on Escape, focus the close button on open
  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-md-4 bg-alt/40
        backdrop-blur-sm"
      onClick={onClose}
      role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="w-container-review rounded-xl bg-white p-2xl-3 flex flex-col items-center
          gap-xl text-center shadow-xl">

        <div className="flex flex-col gap-xs">
          <h2
            id="checkout-modal-title"
            className="text-lg font-semibold text-alt leading-compact">
            Order confirmed! 🎉
          </h2>
          <p className="text-sm sm:text-sm-2 font-medium text-grey leading-tall">
            Thanks for building your security system with us. An invoice of your
            purchase is on its way to your inbox!
          </p>
        </div>

        <div className="w-full rounded-lg bg-icon-bg px-md-4 py-md flex
          items-center justify-between">
          <span className="text-sm-2 text-alt font-medium">
            Total charged
            </span>
          <span className="text-xl font-bold text-green">
            ${total.toFixed(2)}
          </span>
        </div>

        {
          savings > 0 && (
            <p className="text-sm-2 font-semibold text-green">
              You saved ${savings.toFixed(2)} on this order!
            </p>
          )
        }

        <Button
          ref={closeButtonRef}
          onClick={onClose}
          text="Back to my system"/>
      </div>
    </div>
  );
};

export default CheckoutModal;