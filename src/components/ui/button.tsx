"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-copper-500 to-copper-600 text-white hover:from-copper-600 hover:to-copper-700 shadow-lg shadow-copper-500/25",
        destructive:
          "bg-red-900/50 text-red-300 hover:bg-red-900/70 border border-red-800",
        outline:
          "border border-zinc-700 bg-transparent hover:bg-zinc-800 text-zinc-300",
        secondary:
          "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700",
        ghost: "hover:bg-zinc-800 text-zinc-400 hover:text-zinc-300",
        link: "text-copper-400 underline-offset-4 hover:underline",
        premium:
          "bg-gradient-to-r from-copper-500 via-brown-500 to-copper-600 text-white hover:opacity-90 shadow-xl shadow-copper-500/30",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
