import React from "react";
import { MdSend } from "react-icons/md";
import { Input, InputProps } from "../ui/input";
import { cn } from "@/lib/utils";

interface InputWithSendButtonProps extends InputProps {
  onSubmit: () => void;
}

const InputWithSendButton = React.forwardRef<HTMLInputElement, InputWithSendButtonProps>(
  ({ className, type, children, onSubmit, ...props }, ref) => {
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        onSubmit();
      }
    };

    return (
      <div className="relative flex items-center">
        <Input
          type={type}
          className={cn(
            "pr-10", // Add padding to the right to make space for the button
            "break-all", // Ensure text wraps to next line when needed
            className
          )}
          ref={ref}
          onKeyPress={handleKeyPress}
          {...props}
        />
        {children}
        <button
          type="button"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition duration-200"
          onClick={onSubmit}
        >
          <MdSend />
        </button>
      </div>
    );
  }
);

InputWithSendButton.displayName = "InputWithSendButton";

export { InputWithSendButton };
