import { create } from "zustand";
import { devtools } from "zustand/middleware"

import { IProduct, IVariant } from "@/utils/types";

interface ProductStore {
  products: IProduct[];
  setProducts: (products: IProduct[]) => void;
  addProduct: (product: IProduct) => void;
  updateProduct: (id: number, updatedProductData: Partial<IProduct>) => void;
  updateVariant: (
    productId: number,
    variantId: number,
    updatedVariant: Partial<IVariant>
  ) => void;
  removeProduct: (id: number) => void;
  removeEmptyProducts: () => void;
  updatePosition: (id: number, index: number) => void;
  removeVariant: (productId: number, variantId: number) => void;
  updateVariantPosition: (
    productId: number,
    variantId: number,
    index: number
  ) => void;
}

export const useProductStore = create<ProductStore>()(devtools((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),
  updateProduct: (id, updatedProductData) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.id === id ? { ...product, ...updatedProductData } : product
      ),
    })),
  updateVariant: (productId, variantId, updatedVariant) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.id === productId
          ? {
              ...product,
              variants: product.variants.map((variant) =>
                variant.id === variantId
                  ? { ...variant, ...updatedVariant }
                  : variant
              ),
            }
          : product
      ),
    })),
  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((product) => product.id !== id),
    })),

  removeEmptyProducts: () =>
    set((state) => ({
      products: state.products.filter((product) => product.variants.length > 0),
    })),

  updatePosition: (id, index) =>
    set((state) => {
      const productIndex = state.products.findIndex(
        (product) => product.id === id
      );
      if (productIndex !== -1 && index >= 0 && index < state.products.length) {
        const updatedProducts = [...state.products];
        const [movedProduct] = updatedProducts.splice(productIndex, 1);
        updatedProducts.splice(index, 0, movedProduct);
        return { products: updatedProducts };
      }
      return state;
    }),

  removeVariant: (productId, variantId) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.id === productId
          ? {
              ...product,
              variants: product.variants.filter(
                (variant) => variant.id !== variantId
              ),
            }
          : product
      ),
    })),

  updateVariantPosition: (productId, variantId, index) =>
    set((state) => {
      const product = state.products.find((p) => p.id === productId);
      if (!product) return state;

      const variantIndex = product.variants.findIndex(
        (v) => v.id === variantId
      );
      if (
        variantIndex === -1 ||
        index < 0 ||
        index >= product.variants.length
      ) {
        return state;
      }

      const updatedProducts = state.products.map((p) => {
        if (p.id === productId) {
          const updatedVariants = [...p.variants];
          const [movedVariant] = updatedVariants.splice(variantIndex, 1);
          updatedVariants.splice(index, 0, movedVariant);
          return { ...p, variants: updatedVariants };
        }
        return p;
      });

      return { products: updatedProducts };
    }),
})));
