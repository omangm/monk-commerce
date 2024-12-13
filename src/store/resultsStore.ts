import { ISearchResult, IVariant } from "@/utils/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface ResultsStore {
	searchResults: ISearchResult[];
	setResults: (searchResults: ISearchResult[]) => void;
	addResults: (searchResults: ISearchResult[]) => void;
	selectedVariants: { [productId: number]: Set<number> };
	toggleProductSelection: (
		productId: number,
		variants: IVariant[],
		isSelected: boolean,
	) => void;
	toggleVariantSelection: (
		productId: number,
		variantId: number,
		isSelected: boolean,
	) => void;
	resetVariantsSelection: () => void;
}

export const useResultsStore = create<ResultsStore>()(
	devtools((set) => ({
		searchResults: [],
		selectedVariants: {},

		setResults: (searchResults) => set({ searchResults }),
		addResults: (searchResults) =>
			set((state) => ({
				searchResults: [...state.searchResults, ...searchResults],
			})),

		toggleProductSelection: (
			productId: number,
			variants: IVariant[],
			isSelected: boolean,
		) =>
			set((state) => {
				const newSelectedVariants = { ...state.selectedVariants };
				if (isSelected) {
					newSelectedVariants[productId] = new Set(variants.map((v) => v.id));
				} else {
					delete newSelectedVariants[productId];
				}
				return {
					...state,
					selectedVariants: newSelectedVariants,
				};
			}),

		toggleVariantSelection: (
			productId: number,
			variantId: number,
			isSelected: boolean,
		) =>
			set((state) => {
				const updated = new Set(state.selectedVariants[productId] || []);
				if (isSelected) {
					updated.add(variantId);
				} else {
					updated.delete(variantId);
				}

				const newSelectedVariants = { ...state.selectedVariants };
				if (updated.size === 0) {
					delete newSelectedVariants[productId];
				} else {
					newSelectedVariants[productId] = updated;
				}

				return {
					...state,
					selectedVariants: newSelectedVariants,
				};
			}),

		resetVariantsSelection: () => set((state) => (state.selectedVariants = {})),
	})),
);
