import { useProductStore } from "@/store/productStore";
import { IVariant } from "@/utils/types";
import { DraggableProvided } from "@hello-pangea/dnd";
import { GripVerticalIcon, X } from "lucide-react";

export const Variant = ({
  variant,
  productId,
  dragHandleProps,
}: {
  variant: IVariant;
  productId: number;
  dragHandleProps?: DraggableProvided["dragHandleProps"];
}) => {
  const { updateVariant, removeVariant } = useProductStore();

  return (
    <div className="flex items-center gap-[14px] my-4">
      <div {...dragHandleProps}>
        <GripVerticalIcon className="text-[#00000080] cursor-grab" />
      </div>
      <div className="w-[220px]">
        <p
          title={variant.title}
          className="border rounded-full border-[#00000012] px-4 py-1 truncate"
        >
          {variant.title}
        </p>
      </div>
      <div className="relative">
        {variant.discount && (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={variant.discount.value}
              onChange={(e) => {
                if (variant.discount) {
                  const maxValue =
                    variant.discount.type === "percentage"
                      ? 100
                      : variant.price;
                  if (parseFloat(e.target.value) > maxValue) {
                    return;
                  }

                  updateVariant(productId, variant.id, {
                    discount: {
                      ...variant.discount,
                      value: Math.min(parseFloat(e.target.value)),
                    },
                  });
                }
              }}
              className="w-16 p-1 px-2 text-xs rounded-full border border-graphite-gray border-opacity-10 shadow focus:outline-none focus:border-primary focus:border-opacity-90 disabled:cursor-not-allowed disabled:bg-opacity-80 focus:shadow-none"
              min={0}
              max={variant.discount.type === "percentage" ? 100 : variant.price}
            />
            <select
              onChange={(e) => {
                if (variant.discount) {
                  updateVariant(productId, variant.id, {
                    discount: {
                      ...variant.discount,
                      type: e.target.value as "flat" | "percentage",
                    },
                  });
                }
              }}
              className="cursor-pointer px-2 rounded-full py-[6px] w-20 text-xs bg-white border border-graphite-gray border-opacity-10 shadow focus:outline-none focus:border-[#008060] focus:border-opacity-90 focus:shadow-none disabled:cursor-not-allowed disabled:bg-opacity-80"
            >
              <option className="text-xs" value="flat">
                Flat Off
              </option>
              <option className="text-xs" value="percentage">
                % Off
              </option>
            </select>
          </div>
        )}
      </div>
      <button onClick={() => removeVariant(productId, variant.id)}>
        <X width={20} height={20} className="text-[#00000066]" />
      </button>
    </div>
  );
};
