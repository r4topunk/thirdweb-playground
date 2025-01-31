import React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PrefixedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  prefix: string;
}

const PrefixedInput = React.forwardRef<HTMLInputElement, PrefixedInputProps>(
  ({ className, prefix, type, ...props }, ref) => {
    return (
      <div className="flex items-center rounded-md border border-input bg-background text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <span className="flex select-none items-center pl-3 pr-0.5 text-muted-foreground">
          {prefix}
        </span>
        <Input
          type={type}
          className={cn(
            "border-0 focus-visible:ring-0 focus-visible:ring-offset-0 !pl-0",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
PrefixedInput.displayName = "PrefixedInput";

export { PrefixedInput };
