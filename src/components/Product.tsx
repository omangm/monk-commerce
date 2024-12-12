import { IVariant, IDiscount } from "@/utils/types";
import { useProductStore } from "@/store/productStore";
import {
  ChevronDown,
  ChevronUp,
  GripVerticalIcon,
  Pencil,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
  DraggableProvided,
} from "@hello-pangea/dnd";
import { Variant } from "./Variant";

interface ProductProps {
  id: number;
  title: string;
  variants: IVariant[];
  discount?: IDiscount;
  modalHandler?: (state: boolean) => void;
  provided: DraggableProvided;
}

export const Product = ({
  id,
  title,
  discount,
  modalHandler,
  variants,
  provided,
}: ProductProps) => {
  const [areVariantsVisible, setAreVariantsVisible] = useState(false);
  const { updateProduct, removeProduct, updateVariantPosition } =
    useProductStore();

  const variantDragEndHandler = (result: DropResult) => {
    const { source, destination, draggableId } = result;


    // If the item is dropped outside the list or in the same position, do nothing
    if (!destination || source.index === destination.index) {
      return;
    }

    // console.log(result);


    updateVariantPosition(id, Number(draggableId), destination.index);
  };

  return (
    <div>
      <div className="flex cursor-default items-center gap-4">
        <div {...provided.dragHandleProps}>
          <GripVerticalIcon className="text-[#00000080] cursor-grab" />
        </div>
        <div
          onClick={() => modalHandler?.(true)}
          className="flex items-center justify-between border rounded-[4px] border-black border-opacity-10 w-64 py-1 px-2 shadow-[0px_2px_4px_0px_rgba(0,_0,_0,_0.1)] cursor-pointer"
        >
          <span className="text-sh-gray text-sm">
            {title || "Select Product"}
          </span>
          <button>
            <Pencil width={16} height={16} className="text-[#00000033]" />
          </button>
        </div>

        <div className="relative">
          {discount ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={discount.value}
                onChange={(e) => {
                  updateProduct(id, {
                    discount: {
                      ...discount,
                      value: parseFloat(e.target.value),
                    },
                  });
                }}
                className="w-16 p-1 text-sm rounded border border-graphite-gray border-opacity-10 shadow focus:outline-none focus:border-primary focus:border-opacity-90 disabled:cursor-not-allowed disabled:bg-opacity-80 focus:shadow-none"
              />
              <select
                onChange={(e) => {
                  updateProduct(id, {
                    discount: {
                      ...discount,
                      type: e.target.value as "flat" | "percentage",
                    },
                  });
                }}
                className="cursor-pointer rounded py-[6px] w-20 text-sm bg-white border border-graphite-gray border-opacity-10 shadow focus:outline-none focus:border-[#008060] focus:border-opacity-90 focus:shadow-none disabled:cursor-not-allowed disabled:bg-opacity-80"
              >
                <option className="text-sm" value="flat">
                  Flat Off
                </option>
                <option className="text-sm" value="percentage">
                  % Off
                </option>
              </select>
            </div>
          ) : (
            <button
              disabled={variants.length === 0}
              className="bg-primary text-white text-sm font-bold px-4 py-1 rounded-[4px] disabled:cursor-not-allowed disabled:bg-opacity-80"
              onClick={() => {
                updateProduct(id, {
                  discount: { value: 0, type: "percentage" },
                });
              }}
            >
              Add Discount
            </button>
          )}
        </div>

        <button onClick={() => removeProduct(id)}>
          <X className="text-[#00000066]" />
        </button>
      </div>

      {variants.length > 1 && (
        <>
          <div className="flex justify-end">
            <button
              onClick={() => setAreVariantsVisible(!areVariantsVisible)}
              className="py-2 underline text-[#006EFF]"
            >
              {areVariantsVisible ? "Hide" : "Show"}{" "}
              {variants.length > 1 ? "Variants" : "Variant"}
              {areVariantsVisible ? (
                <ChevronUp width={20} height={20} className="inline" />
              ) : (
                <ChevronDown width={20} height={20} className="inline" />
              )}
            </button>
          </div>

          <div>
            {areVariantsVisible && (
              <DragDropContext onDragEnd={variantDragEndHandler}>
                <Droppable droppableId={id.toString()}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="ml-10 pb-4 space-y-2"
                    >
                      {variants.map((variant, index) => (
                        <Draggable
                          key={variant.id}
                          draggableId={variant.id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                              <Variant
                                productId={id}
                                variant={variant}
                                dragHandleProps={provided.dragHandleProps}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>
        </>
      )}
    </div>
  );
};

