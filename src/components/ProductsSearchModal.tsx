import searchIcon from "@/assets/search-icon.svg";
import { fetchProducts } from "@/queries/products";
import { ChangeEvent, useState } from "react";
import ProductsResult from "./ProductsResult";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const ProductsSearchModal = ({ isOpen, onClose, title }: ModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[560px]">
        <div className="flex justify-between items-center px-4 py-2 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <div className="p-4">
          <div className="border-b rounded-[4px] border-black border-opacity-10">
            <div className="flex items-center border rounded-[4px] border-black border-opacity-10 p-1">
              <label htmlFor="product-search">
                <img src={searchIcon} alt="search" />
              </label>
              <input
                id="product-search"
                type="text"
                className="grow ml-2 w-full active:outline-none focus:outline-none"
                onChange={async (e: ChangeEvent<HTMLInputElement>) =>
                    setSearchQuery(e.target.value)
                }
                value={searchQuery}
              />
            </div>
          </div>
        </div>
          <ProductsResult query={searchQuery} />
        <div className="p-4 flex items-center justify-between border-t border-black border-opacity-10">
          <p className="text-sm text-black text-opacity-90 font-medium">
            1 product selected
          </p>
          <div className="flex gap-2 items-center">
            <button className="text-sm font-medium px-6 py-1 text-black text-opacity-60 border rounded-[4px] border-black border-opacity-40">
              Cancel
            </button>
            <button
              onClick={async () => {
                const response = await fetchProducts("s", 2);

                console.log(response);
              }}
              className="text-sm font-medium px-6 py-1 bg-primary text-white boder rounded-[4px] border-primary"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
