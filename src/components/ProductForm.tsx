import { ProductList } from "./ProductList"

export const ProductForm = () => {

    return (
        <div className="w-full py-4 px-4 2xl:px-48 h-full">
            <p className="text-lg text-graphite-gray font-semibold">Add Products</p>
            <ProductList />
        </div>
    )
}