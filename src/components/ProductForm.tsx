import { useProductStore } from "@/store/productStore";
import { Product } from "./Product";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { useCallback, useState } from "react";
import { useResultsStore } from "@/store/resultsStore";
import { ProductsSearchModal } from "./ProductsSearchModal";

export const ProductForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { products, addProduct, updatePosition } = useProductStore();
  const { setResults, resetVariantsSelection } = useResultsStore();

  const dragEndHandler = useCallback(
    (result: DropResult) => {
      const { source, destination, draggableId } = result;

      // If the item is dropped outside the list or in the same position, do nothing
      if (!destination || source.index === destination.index) {
        return;
      }

      updatePosition(Number(draggableId), destination.index);
    },
    [updatePosition]
  ); // Empty dependency array to memoize the function

  const modalHandler = (modalState: boolean) => {
    setIsModalOpen(modalState);
  };

  return (
    <div className="w-full mb-24 py-4 px-4 2xl:px-48">
      <p className="text-lg text-graphite-gray font-semibold mb-8">
        Add Products
      </p>
      {products.length > 0 && (
        <div className="flex items-center ml-10 pl-0 py-4 gap-4">
          <p className="w-64">Product</p>
          <p className="">Discount</p>
        </div>
      )}

      <div className="pb-24">
        <DragDropContext onDragEnd={dragEndHandler}>
          <Droppable droppableId="products-list">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {products.map((product, index) => (
                  <Draggable
                    key={product.id}
                    draggableId={product.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="pt-4 pb-8 min-w-[500px] w-fit border-b border-black border-opacity-10 cursor-default"
                      >
                        <Product
                          key={product.id}
                          id={product.id}
                          title={product.title}
                          variants={product.variants}
                          discount={product.discount}
                          modalHandler={modalHandler}
                          provided={provided}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <div className="flex items-center">
        <button
          onClick={() => {
            const newProduct = {
              id: Date.now(),
              title: "Select Product",
              variants: [],
              image: undefined,
              test: 123,
            };
            addProduct(newProduct);
          }}
          className="text-primary text-sm px-8 rounded-[4px] py-2 border border-primary font-bold"
        >
          Add Product
        </button>
      </div>
      {isModalOpen && (
        <ProductsSearchModal
          isOpen={isModalOpen}
          onClose={() => {
            resetVariantsSelection();
            setResults([]);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
