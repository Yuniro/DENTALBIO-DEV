'use client'
import BlogImage from "@/app/components/Image/BlogImage";
import ConfirmMessage from "@/app/components/Modal/ConfirmMessagel";
import { formatCurrency } from "@/utils/functions/formatCurrency";
import { ArrowSquareOut, CaretDown, CaretUp, PencilSimple, Trash } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import React, { useEffect, useReducer, useState } from "react"

type ProductCardProps = ProductType & {
  onUpdate: (product: ProductType, image: null) => void;
  onEditItem: (id: string) => void;
  onDelete: (id: string) => void;
}

const InvidualProductCard: React.FC<ProductCardProps> = ({
  onUpdate,
  onEditItem,
  onDelete,
  ...productProps
}: ProductCardProps) => {
  const [isOpenConfirmMessage, setIsOpenConfirmMessage] = useState<boolean>(false);
  const [isActive, toggleIsActive] = useReducer((prevState) => !prevState, productProps.enabled!);

  useEffect(() => {
    if (productProps.enabled !== isActive) {
      const product = {
        id: productProps.id, enabled: isActive
      }
      onUpdate(product, null);
    }
  }, [isActive]);

  const handleDelete = () => {
    onDelete(productProps.id!);
    setIsOpenConfirmMessage(false);
  }

  return (
    <>
      <div className="w-full px-6 py-3 shadow rounded-[26px] flex items-center overflow-hidden gap-4 mb-4">
        {/* Caret Buttons */}
        <div className="cursor-pointer">
          <div><CaretUp /></div>
          <div><CaretDown /></div>
        </div>

        {/* Image */}
        <BlogImage src={productProps.image_url!} alt={productProps.name!} className="w-24 h-24 rounded-md" />

        {/* Title and Content */}
        <div className="flex-grow overflow-hidden">
          {/* Title Row */}
          {/* <div className="flex flex-1 items-center truncate gap-2"> */}
          <div className="text-[14px]">
            <div className="font-medium truncate">{productProps.platform}</div>
            <div className="text-primary-1 font-bold truncate">{productProps.name}</div>
            <div className="text-gray-500 font-medium truncate">{formatCurrency(productProps.currency!)}{productProps.price}</div>
          </div>
          {/* </div> */}

          {/* Content Row */}
          <div className="flex justify-end items-center gap-2">
            <PencilSimple
              size={18}
              className="cursor-pointer hover:text-primary-1"
              onClick={() => onEditItem(productProps.id!)}
            />

            <Link
              href={productProps.link!}
              target="_blank"
              className="hover:bg-neutral-100 hover:text-primary-1 text-neutral-900 flex items-center justify-center rounded-md transition-all"
            >
              <ArrowSquareOut size={20} />
            </Link>

            <div onClick={() => setIsOpenConfirmMessage(true)}>
              <Trash size={20} className="cursor-pointer hover:text-red-700" />
            </div>

            <div className="form-check form-switch custom-form-check">
              <input
                className="form-check-input cursor-pointer w-8"
                type="checkbox"
                role="switch"
                // id={`flexSwitchCheckChecked-${link.link_id}`}
                checked={isActive}
                onChange={toggleIsActive}
              />
            </div>
          </div>
        </div>
      </div>

      <ConfirmMessage
        description="Aure you sure you want to delete the product?"
        okText="Delete"
        isOpen={isOpenConfirmMessage}
        onClose={() => setIsOpenConfirmMessage(false)}
        onOk={handleDelete}
      />
    </>
  )
}

export default InvidualProductCard;