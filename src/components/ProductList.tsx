import { useState, useCallback } from "react";
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
} from "@hello-pangea/dnd";

import DragIcon from "@/assets/drag-icon.svg";

interface Product {
    id: string;
    name: string;
}

export const ProductList = () => {
    const [products, setProducts] = useState<Product[]>([
        { id: "test", name: "TEST" },
        { id: "lorem", name: "LOREM" },
        { id: "ipsum", name: "IPSUM" },
        { id: "sad", name: "12" },
        { id: "adsf", name: "314" },
    ]);

    const dragEndHandler = useCallback((result: DropResult) => {
        const { source, destination } = result;

        // If the item is dropped outside the list or in the same position, do nothing
        if (!destination || source.index === destination.index) {
            return;
        }

        // Use functional update to prevent unnecessary re-renders
        setProducts((prevProducts) => {
            const productsCopy = [...prevProducts];
            const [movedProduct] = productsCopy.splice(source.index, 1);
            productsCopy.splice(destination.index, 0, movedProduct);
            return productsCopy;
        });
    }, []); // Empty dependency array to memoize the function

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Product List</h2>
            <DragDropContext onDragEnd={dragEndHandler}>
                <Droppable droppableId="product-list-1">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-2"
                        >
                            {products.map((product, index) => (
                                <Draggable
                                    key={product.id}
                                    draggableId={product.id}
                                    index={index}
                                >
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="flex gap-4 items-center cursor-grab"
                                        >
                                            <div>
                                                <img src={DragIcon} alt="" />
                                            </div>
                                            <div
                                                className={`
                                                text-primary
                                                grow 
                                                p-4 
                                                text-xl 
                                                font-semibold 
                                                border 
                                                flex
                                                gap-4
                                                cursor-default
                                                ${snapshot.isDragging
                                                        ? "bg-primary bg-opacity-10 shadow-lg"
                                                        : "bg-white"
                                                    }
                                            `}
                                            onMouseDown={(e) => {
                                                e.stopPropagation();
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                            }}
                                            >
                                                <p>{product.name}</p>
                                                <input
                                                    id="dnd-drag"
                                                    type="text"
                                                    className="border border-black border-opacity-5 shadow p-2"

                                                />
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default ProductList;
