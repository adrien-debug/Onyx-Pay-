import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-zinc-800 text-zinc-300 border border-zinc-700",
        copper: "bg-copper-900/50 text-copper-300 border border-copper-800",
        success: "bg-emerald-900/50 text-emerald-300 border border-emerald-800",
        warning: "bg-amber-900/50 text-amber-300 border border-amber-800",
        danger: "bg-red-900/50 text-red-300 border border-red-800",
        info: "bg-blue-900/50 text-blue-300 border border-blue-800",
        purple: "bg-purple-900/50 text-purple-300 border border-purple-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
