import { fetchProducts } from "@/queries/products";
import { debounce } from "@/utils/debounce";
import { IProduct, ISearchResult } from "@/utils/types";
import { useCallback, useEffect, useRef, useState, memo } from "react";
import { Checkbox } from "./Checkbox";
import { useResultsStore } from "@/store/resultsStore";

const ProductsResult = ({ query }: { query: string }) => {
	const [page, setPage] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [areAllResultsFetched, setAreAllResultsFetched] = useState(false);
	const { searchResults, addResults, setResults } = useResultsStore();
	const observerRef = useRef<HTMLDivElement | null>(null);

	const fetchSearchResults = useCallback(
		async (searchQuery: string, pageNum: number) => {
			setIsLoading(true);
			try {
				const response: IProduct[] = await fetchProducts(searchQuery, pageNum);

				const validProducts = response.filter((product) =>
					product.variants.some(
						(variant) =>
							variant.inventory_quantity > 0 &&
							String(variant.price) &&
							parseFloat(String(variant.price)) > 0,
					),
				);

				const searchResults: ISearchResult[] = validProducts.map((product) => ({
					...product,
					selected: false,
					variants: product.variants.filter(
						(variant) =>
							variant.inventory_quantity > 0 &&
							String(variant.price) &&
							parseFloat(String(variant.price)) > 0,
					),
				}));

				if (!validProducts || validProducts.length === 0) {
					setAreAllResultsFetched(true);
					if (pageNum === 1) setResults([]);
					return;
				}

				if (pageNum === 1) {
					setResults(searchResults);
				} else {
					addResults(searchResults);
				}
			} catch (error) {
				console.error("Error fetching products:", error);
				setAreAllResultsFetched(true);
			} finally {
				setIsLoading(false);
			}
		},
		[setResults, addResults, setIsLoading, setAreAllResultsFetched],
	);

	const debouncedSearch = useCallback(
		(searchQuery: string) => {
			debounce(() => {
				setPage(1);
				setAreAllResultsFetched(false);
				fetchSearchResults(searchQuery, 1);
			}, 750)();
		},
		[fetchSearchResults],
	);

	useEffect(() => {
		if (query.trim()) {
			debouncedSearch(query);
		} else {
			setResults([]);
			setAreAllResultsFetched(false);
		}
	}, [query, debouncedSearch, setResults]);

	useEffect(() => {
		if (!observerRef.current) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (
					entry.isIntersecting &&
					!isLoading &&
					!areAllResultsFetched &&
					query.length >= 2
				) {
					setPage((prev) => {
						const nextPage = prev + 1;
						fetchSearchResults(query, nextPage);
						return nextPage;
					});
				}
			},
			{ threshold: 0.1, rootMargin: "100px" },
		);

		observer.observe(observerRef.current);
		return () => observer.disconnect();
	}, [query, isLoading, areAllResultsFetched, fetchSearchResults]);

	return (
		<div className="h-[60vh] overflow-auto border-t border-black border-opacity-10">
			{isLoading && page === 1 ? (
				<p className="py-4 text-center text-gray-500">Searching...</p>
			) : searchResults.length === 0 && query.length > 2 ? (
				<p className="py-4 text-center text-gray-500">No products found</p>
			) : (
				<>
					{searchResults.map((product) => (
						<SearchResult key={product.id} product={product} />
					))}
					{!areAllResultsFetched && (
						<div
							ref={observerRef}
							className="flex h-10 items-center justify-center text-gray-500"
						>
							{isLoading ? "Loading more products..." : "Scroll for more"}
						</div>
					)}
					{areAllResultsFetched && (
						<p className="py-4 text-center text-gray-500">
							No more products to load
						</p>
					)}
				</>
			)}
		</div>
	);
};

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
				{product.image?.src && (
					<img
						src={product.image.src}
						alt={product.title || "Product image"}
						className="h-8 w-8 rounded"
						onError={(e) => {
							(e.target as HTMLImageElement).style.display = "none";
						}}
						loading="lazy"
					/>
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

export default ProductsResult;
