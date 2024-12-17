import { fetchProducts } from "@/queries/products";
import { debounce } from "@/utils/debounce";
import { IProduct, ISearchResult } from "@/utils/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { useResultsStore } from "@/store/resultsStore";
import SearchResult from "./SearchResult";

const ProductsResult = ({ query }: { query: string }) => {
	const [page, setPage] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [areAllResultsFetched, setAreAllResultsFetched] = useState(false);
	const { searchResults, addResults, setResults } = useResultsStore();
	const observerRef = useRef<HTMLDivElement | null>(null);

	const fetchSearchResults = useCallback(
		async (searchQuery: string, pageNum: number) => {
			setIsLoading(true);
			try {
				const response: IProduct[] = await fetchProducts(searchQuery, pageNum);

				const searchResults: ISearchResult[] = response.map((product) => ({
					...product,
					selected: false,
				}));

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
				if (entry.isIntersecting && !isLoading && !areAllResultsFetched) {
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

export default ProductsResult;
