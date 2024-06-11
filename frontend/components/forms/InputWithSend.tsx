import React from "react";
import { MdSend } from "react-icons/md"; // Import the send icon from react-icons
import { Input, InputProps } from "../ui/input"; // Adjust the path if necessary
import { cn } from "@/lib/utils";

const InputWithSendButton = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, children, ...props }, ref) => {
    return (
      <div className="relative flex items-center ">
        <Input
          type={type}
          className={cn(
            "pr-10", // Add padding to the right to make space for the button
            className
          )}
          ref={ref}
          {...props}
        />
        {children}
        <button
          type="button"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition duration-200"
          onClick={() => console.log("Send button clicked!")}
        >
          <MdSend/>
        </button>
      </div>
    );
  }
);

InputWithSendButton.displayName = "InputWithSendButton";

export { InputWithSendButton };
