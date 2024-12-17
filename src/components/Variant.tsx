import { useProductStore } from "@/store/productStore";
import { IVariant } from "@/utils/types";
import { DraggableProvided } from "@hello-pangea/dnd";
import { GripVerticalIcon, X } from "lucide-react";

export const Variant = ({
	variant,
	productId,
	dragHandleProps,
}: {
	variant: IVariant;
	productId: number;
	dragHandleProps?: DraggableProvided["dragHandleProps"];
}) => {
	const { updateVariant, removeVariant } = useProductStore();

	return (
		<div className="py-2 flex items-center gap-[14px]">
			<div {...dragHandleProps}>
				<GripVerticalIcon className="cursor-grab text-[#00000080]" />
			</div>
			<div className="w-[220px]">
				<p
					title={variant.title}
					className="truncate rounded-full border border-[#00000012] px-4 py-1"
				>
					{variant.title}
				</p>
			</div>
			<div className="relative">
				{variant.discount && (
					<div className="flex items-center gap-2">
						<input
							type="number"
							value={variant.discount.value}
							onChange={(e) => {
								if (variant.discount) {
									const maxValue =
										variant.discount.type === "percentage"
											? 100
											: variant.price;
									if (parseFloat(e.target.value) > maxValue) {
										return;
									}

									updateVariant(productId, variant.id, {
										discount: {
											...variant.discount,
											value: Math.min(parseFloat(e.target.value)),
										},
									});
								}
							}}
							className="w-16 rounded-full border border-graphite-gray border-opacity-10 p-1 px-2 text-xs shadow focus:border-primary focus:border-opacity-90 focus:shadow-none focus:outline-none disabled:cursor-not-allowed disabled:bg-opacity-80"
							min={0}
							max={variant.discount.type === "percentage" ? 100 : variant.price}
						/>
						<select
							onChange={(e) => {
								if (variant.discount) {
									updateVariant(productId, variant.id, {
										discount: {
											...variant.discount,
											type: e.target.value as "flat" | "percentage",
										},
									});
								}
							}}
							className="w-20 cursor-pointer rounded-full border border-graphite-gray border-opacity-10 bg-white px-2 py-[6px] text-xs shadow focus:border-[#008060] focus:border-opacity-90 focus:shadow-none focus:outline-none disabled:cursor-not-allowed disabled:bg-opacity-80"
						>
							<option className="text-xs" value="flat">
								Flat Off
							</option>
							<option className="text-xs" value="percentage">
								% Off
							</option>
						</select>
					</div>
				)}
			</div>
			<button onClick={() => removeVariant(productId, variant.id)}>
				<X width={20} height={20} className="text-[#00000066]" />
			</button>
		</div>
	);
};
