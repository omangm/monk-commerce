import editIcon from "@/assets/edit-icon.svg";
import DragIcon from "@/assets/drag-icon.svg";
import { IProduct } from "@/utils/types";
import { useState } from "react";
import { ProductsSearchModal } from "./ProductsSearchModal";

export const Product = ({ title }: IProduct) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex items-center gap-4">
      <div>
        <img src={DragIcon} alt="" />
      </div>
      <div className=" flex items-center justify-between border rounded-[4px] border-black border-opacity-10 w-64 py-1 px-2 shadow-[0px_2px_4px_0px_rgba(0,_0,_0,_0.1)]">
        <span className="text-sh-gray text-sm ">
          {title || "Select Product"}
        </span>
        <button onClick={() => setIsModalOpen(true)}>
          <img src={editIcon} />
        </button>
      </div>

      <button className="bg-primary text-white text-sm font-bold px-4 py-1 rounded-[4px]">
        Add Discount
      </button>
      <ProductsSearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Products"
      />
    </div>
  );
};
