import { ChangeEvent, useState } from "react";
import ProductsResult from "./ProductsResult";
import { useResultsStore } from "@/store/resultsStore";
import { useProductStore } from "@/store/productStore";
import { IDiscount, IProduct } from "@/utils/types";
import { Search, X } from "lucide-react";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
}

export const ProductsSearchModal = ({ isOpen, onClose, title }: ModalProps) => {
	const [searchQuery, setSearchQuery] = useState("");
	const { searchResults, selectedVariants } = useResultsStore();
	const { addProduct, removeEmptyProducts, updateProduct, products } =
		useProductStore();

	if (!isOpen) return null;

	const handleAddProducts = () => {
		// Get the selected products from results
		const selectedProducts: IProduct[] = Array.from(
			new Map(
				searchResults
					.filter((product) => selectedVariants[product.id]?.size > 0)
					.map((product) => [
						product.id,
						{
							id: product.id, // Generate unique ID for each product
							title: product.title,
							variants: product.variants
								.filter((variant) => selectedVariants[product.id]?.has(variant.id))
								.map((variant) => ({
									...variant,
									discount: {
										type: "percentage" as IDiscount["type"],
										value: 0,
									},
								})),
							image: product.image,
						},
					])
			).values()
		);

		// Remove any empty products
		removeEmptyProducts();

		selectedProducts.forEach((product) => {
			const existingProduct = products.find((p) => p.id === product.id);
			if (existingProduct) {
				updateProduct(product.id, product);
			} else {
				addProduct(product);
			}
		});

		onClose();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div className="w-[720px] rounded-lg bg-white shadow-lg">
				<div className="flex items-center justify-between border-b px-4 py-2">
					<h2 className="text-lg font-semibold">{title}</h2>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700"
					>
						<X className="text-[#000000CC]" />
					</button>
				</div>
				<div className="p-4">
					<div className="rounded-[4px] border-b border-black border-opacity-10">
						<div className="flex items-center rounded-[4px] border border-black border-opacity-10 p-1">
							<label htmlFor="product-search">
								<Search width={16} height={16} className="text-[#00000066]" />
							</label>
							<input
								id="product-search"
								type="text"
								className="ml-2 w-full grow focus:outline-none active:outline-none"
								onChange={async (e: ChangeEvent<HTMLInputElement>) =>
									setSearchQuery(e.target.value)
								}
								value={searchQuery}
							/>
						</div>
					</div>
				</div>
				<ProductsResult query={searchQuery} />
				<div className="flex items-center justify-between border-t border-black border-opacity-10 p-4">
					<p className="text-sm font-medium text-black text-opacity-90">
						{Object.keys(selectedVariants).length} products selected
					</p>
					<div className="flex items-center gap-2">
						<button className="rounded-[4px] border border-black border-opacity-40 px-6 py-1 text-sm font-medium text-black text-opacity-60">
							Cancel
						</button>
						<button
							onClick={handleAddProducts}
							className="boder rounded-[4px] border-primary bg-primary px-6 py-1 text-sm font-medium text-white"
						>
							Add
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
