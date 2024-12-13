import { useProductStore } from "@/store/productStore";
import { Product } from "./Product";
import {
	DragDropContext,
	Draggable,
	Droppable,
	DropResult,
} from "@hello-pangea/dnd";
import { useCallback, useState } from "react";
import { useResultsStore } from "@/store/resultsStore";
import { ProductsSearchModal } from "./ProductsSearchModal";

export const ProductForm = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { products, addProduct, updatePosition } = useProductStore();
	const { setResults, resetVariantsSelection } = useResultsStore();

	const dragEndHandler = useCallback(
		(result: DropResult) => {
			const { source, destination, draggableId } = result;

			// If the item is dropped outside the list or in the same position, do nothing
			if (!destination || source.index === destination.index) {
				return;
			}

			updatePosition(Number(draggableId), destination.index);
		},
		[updatePosition],
	); // Empty dependency array to memoize the function

	const modalHandler = (modalState: boolean) => {
		setIsModalOpen(modalState);
	};

	return (
		<div className="mb-24 w-full px-4 py-4 2xl:px-48">
			<p className="mb-8 text-lg font-semibold text-graphite-gray">
				Add Products
			</p>
			{products.length > 0 && (
				<div className="ml-10 flex items-center gap-4 py-4 pl-0">
					<p className="w-64">Product</p>
					<p className="">Discount</p>
				</div>
			)}

			<div className="pb-24">
				<DragDropContext onDragEnd={dragEndHandler}>
					<Droppable droppableId="products-list">
						{(provided) => (
							<div
								{...provided.droppableProps}
								ref={provided.innerRef}
								className="space-y-2"
							>
								{products.map((product, index) => (
									<Draggable
										key={product.id}
										draggableId={product.id.toString()}
										index={index}
									>
										{(provided) => (
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												className="w-fit min-w-[500px] cursor-default border-b border-black border-opacity-10 pb-8 pt-4"
											>
												<Product
													key={product.id}
													id={product.id}
													title={product.title}
													variants={product.variants}
													discount={product.discount}
													modalHandler={modalHandler}
													provided={provided}
												/>
											</div>
										)}
									</Draggable>
								))}
							</div>
						)}
					</Droppable>
				</DragDropContext>
			</div>

			<div className="flex items-center">
				<button
					onClick={() => {
						const newProduct = {
							id: Date.now(),
							title: "Select Product",
							variants: [],
							image: undefined,
							test: 123,
						};
						addProduct(newProduct);
					}}
					className="rounded-[4px] border border-primary px-8 py-2 text-sm font-bold text-primary"
				>
					Add Product
				</button>
			</div>
			{isModalOpen && (
				<ProductsSearchModal
					isOpen={isModalOpen}
					onClose={() => {
						resetVariantsSelection();
						setResults([]);
						setIsModalOpen(false);
					}}
				/>
			)}
		</div>
	);
};
