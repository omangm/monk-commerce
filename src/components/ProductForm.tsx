import { Product } from "./Product"

export const ProductForm = () => {

    return (
        <div className="w-full py-4 px-4 2xl:px-48 h-full">
            <p className="text-lg text-graphite-gray font-semibold mb-8">Add Products</p>
            <div className="flex items-center ml-10 pl-0 py-4 gap-4">
                <p className="w-64">Product</p>
                <p className="">Discount</p>
            </div>
            <Product id={1} title="" variants={[]} />
            <div className="flex items-center mt-12">
                <button className="text-primary text-sm px-8 rounded-[4px] py-2 border border-primary font-bold">Add Product</button>
            </div>
        </div>
    )
}