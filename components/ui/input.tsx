import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "prefix" | "suffix"
  > {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  wrapperClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, prefix, suffix, wrapperClassName, ...props }, ref) => {
    const inputClassName = cn(
      "flex h-10 w-full rounded-md border border-input bg-background py-2 text-base text-gray-900 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      prefix ? "pl-10" : "pl-3",
      suffix ? "pr-20" : "pr-3",
      className
    );
    if (!prefix && !suffix) {
      return (
        <input type={type} className={inputClassName} ref={ref} {...props} />
      );
    }

    return (
      <div className={cn("relative", wrapperClassName)}>
        {prefix && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2 text-gray-500">
            {prefix}
          </div>
        )}
        <input type={type} className={inputClassName} ref={ref} {...props} />
        {suffix && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2 text-gray-700">
            {suffix}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
