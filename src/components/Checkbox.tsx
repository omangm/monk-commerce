import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import { Check } from "lucide-react";

export interface CheckboxProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
	label?: string;
	variant?: "small" | "medium" | "large";
}

const sizeStyles = {
	small: "w-4 h-4 text-xs",
	medium: "w-6 h-6 text-sm",
	large: "w-8 h-8 text-base",
};

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
	({ className, label, variant = "medium", ...props }, ref) => {
		return (
			<label className="flex cursor-pointer items-center space-x-2">
				<div className="relative">
					<input
						type="checkbox"
						className="peer sr-only"
						ref={ref}
						{...props}
					/>
					<div
						className={cn(
							"rounded border-2 transition-all duration-200",
							"border-[#008060] hover:bg-[#008060]/10",
							"peer-checked:border-[#008060] peer-checked:bg-[#008060]",
							"peer-focus:ring-2 peer-focus:ring-[#008060]/50",
							"peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
							sizeStyles[variant],
							className,
						)}
					/>
					<Check
						className={cn(
							"absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform",
							"text-white opacity-0 transition-opacity duration-200 peer-checked:opacity-100",
							variant === "small"
								? "h-4 w-4"
								: variant === "large"
									? "h-6 w-6"
									: "h-5 w-5",
						)}
					/>
				</div>
				{label && (
					<span className={cn("text-gray-700", sizeStyles[variant])}>
						{label}
					</span>
				)}
			</label>
		);
	},
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
