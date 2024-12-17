import { memo } from "react";
import { useResultsStore } from "@/store/resultsStore";
import { IProduct } from "@/utils/types";
import { Checkbox } from "./Checkbox";
import { Image } from "lucide-react";
import { resizeImage } from "@/utils/imageResizer";

const SearchResult = memo(({ product }: { product: IProduct }) => {
	const { selectedVariants, toggleProductSelection, toggleVariantSelection } =
		useResultsStore();

	const productSelectedVariants = selectedVariants[product.id] || new Set();

	const allVariantsSelected =
		productSelectedVariants.size === product.variants.length;
	const someVariantsSelected =
		productSelectedVariants.size > 0 && !allVariantsSelected;

	return (
		<div>
			<div className="flex items-center gap-4 border-b border-black border-opacity-10 px-6 py-4">
				<Checkbox
					onChange={(e) =>
						toggleProductSelection(
							product.id,
							product.variants,
							e.target.checked,
						)
					}
					checked={allVariantsSelected || someVariantsSelected}
					variant="medium"
				/>
				{product.image?.src ? (
					<img
						src={resizeImage(product.image.src, "32x32")}
						className="h-8 w-8 rounded"
						alt=""
					/>
				) : (
					<Image className="h-6 w-6 rounded text-primary" />
				)}
				<p className="text-lg text-black">{product.title}</p>
			</div>
			<div>
				{product.variants.map((variant) => (
					<div
						key={variant.id}
						className="flex items-center justify-between border-b border-black border-opacity-10 px-10 py-5"
					>
						<div className="flex gap-3">
							<Checkbox
								onChange={(e) =>
									toggleVariantSelection(
										product.id,
										variant.id,
										e.target.checked,
									)
								}
								checked={productSelectedVariants.has(variant.id)}
							/>
							<p className="text-black">{variant.title}</p>
						</div>
						<div className="flex gap-6">
							<p className="text-black">
								{variant.inventory_quantity} available
							</p>
							<p className="text-black">${variant.price}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
});

SearchResult.displayName = "SearchResult";
export default SearchResult;
