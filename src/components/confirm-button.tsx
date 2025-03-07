import { Button } from "@headlessui/react";
import { useState } from "react";

interface ConfirmButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  confirmText?: string;
  onClick: () => void;
}

export const ConfirmButton = ({ confirmText = "Confirm", onClick, children }: ConfirmButtonProps) => {
  const [confirm, setConfirm] = useState(false);

  return (
    <div className="flex gap-2">
      {confirm ? (
        <>
          <Button onClick={onClick}>{confirmText}</Button>
          <Button onClick={() => setConfirm(false)}>Cancel</Button>
        </>
      ) : (
        <Button onClick={() => setConfirm(true)}>{children}</Button>
      )}
    </div>
  );
};
