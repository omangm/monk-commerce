import { IVariant, IDiscount } from "@/utils/types";
import { useProductStore } from "@/store/productStore";
import {
	ChevronDown,
	ChevronUp,
	GripVerticalIcon,
	Pencil,
	X,
} from "lucide-react";
import { useState } from "react";
import {
	DragDropContext,
	Draggable,
	Droppable,
	DropResult,
	DraggableProvided,
} from "@hello-pangea/dnd";
import { Variant } from "./Variant";

interface ProductProps {
	id: number;
	title: string;
	variants: IVariant[];
	discount?: IDiscount;
	modalHandler?: (state: boolean) => void;
	provided: DraggableProvided;
}

export const Product = ({
	id,
	title,
	discount,
	modalHandler,
	variants,
	provided,
}: ProductProps) => {
	const [areVariantsVisible, setAreVariantsVisible] = useState(false);
	const { updateProduct, removeProduct, updateVariantPosition } =
		useProductStore();

	const variantDragEndHandler = (result: DropResult) => {
		const { source, destination, draggableId } = result;

		// If the item is dropped outside the list or in the same position, do nothing
		if (!destination || source.index === destination.index) {
			return;
		}

		// console.log(result);

		updateVariantPosition(id, Number(draggableId), destination.index);
	};

	return (
		<div>
			<div className="flex cursor-default items-center gap-4">
				<div {...provided.dragHandleProps}>
					<GripVerticalIcon className="cursor-grab text-[#00000080]" />
				</div>
				<div
					onClick={() => modalHandler?.(true)}
					className="flex w-64 cursor-pointer items-center justify-between rounded-[4px] border border-black border-opacity-10 px-2 py-1 shadow-[0px_2px_4px_0px_rgba(0,_0,_0,_0.1)]"
				>
					<span className="text-sm text-sh-gray">
						{title || "Select Product"}
					</span>
					<button>
						<Pencil width={16} height={16} className="text-[#00000033]" />
					</button>
				</div>

				<div className="relative">
					{discount ? (
						<div className="flex items-center gap-2">
							<input
								type="number"
								value={discount.value}
								onChange={(e) => {
									updateProduct(id, {
										discount: {
											...discount,
											value: parseFloat(e.target.value),
										},
									});
								}}
								className="w-16 rounded border border-graphite-gray border-opacity-10 p-1 text-sm shadow focus:border-primary focus:border-opacity-90 focus:shadow-none focus:outline-none disabled:cursor-not-allowed disabled:bg-opacity-80"
							/>
							<select
								onChange={(e) => {
									updateProduct(id, {
										discount: {
											...discount,
											type: e.target.value as "flat" | "percentage",
										},
									});
								}}
								className="w-20 cursor-pointer rounded border border-graphite-gray border-opacity-10 bg-white py-[6px] text-sm shadow focus:border-[#008060] focus:border-opacity-90 focus:shadow-none focus:outline-none disabled:cursor-not-allowed disabled:bg-opacity-80"
							>
								<option className="text-sm" value="flat">
									Flat Off
								</option>
								<option className="text-sm" value="percentage">
									% Off
								</option>
							</select>
						</div>
					) : (
						<button
							disabled={variants.length === 0}
							className="rounded-[4px] bg-primary px-4 py-1 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-opacity-80"
							onClick={() => {
								updateProduct(id, {
									discount: { value: 0, type: "percentage" },
								});
							}}
						>
							Add Discount
						</button>
					)}
				</div>

				<button onClick={() => removeProduct(id)}>
					<X className="text-[#00000066]" />
				</button>
			</div>

			{variants.length > 1 && (
				<>
					<div className="flex justify-end">
						<button
							onClick={() => setAreVariantsVisible(!areVariantsVisible)}
							className="py-2 text-[#006EFF] underline"
						>
							{areVariantsVisible ? "Hide" : "Show"}{" "}
							{variants.length > 1 ? "Variants" : "Variant"}
							{areVariantsVisible ? (
								<ChevronUp width={20} height={20} className="inline" />
							) : (
								<ChevronDown width={20} height={20} className="inline" />
							)}
						</button>
					</div>

					<div>
						{areVariantsVisible && (
							<DragDropContext onDragEnd={variantDragEndHandler}>
								<Droppable droppableId={id.toString()}>
									{(provided) => (
										<div
											{...provided.droppableProps}
											ref={provided.innerRef}
											className="ml-10 space-y-2 pb-4"
										>
											{variants.map((variant, index) => (
												<Draggable
													key={variant.id}
													draggableId={variant.id.toString()}
													index={index}
												>
													{(provided) => (
														<div
															ref={provided.innerRef}
															{...provided.draggableProps}
														>
															<Variant
																productId={id}
																variant={variant}
																dragHandleProps={provided.dragHandleProps}
															/>
														</div>
													)}
												</Draggable>
											))}
											{provided.placeholder}
										</div>
									)}
								</Droppable>
							</DragDropContext>
						)}
					</div>
				</>
			)}
		</div>
	);
};
