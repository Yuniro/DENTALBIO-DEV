'use client'
import BlogImage from "@/app/components/Image/BlogImage";
import ConfirmMessage from "@/app/components/Modal/ConfirmMessagel";
import { CaretDown, CaretUp, PencilSimple, Trash } from "@phosphor-icons/react/dist/ssr";
import React, { useEffect, useReducer, useState } from "react"
import Switcher from '@/app/components/Switcher'

type GalleryCardProps = {
  id: string;
  title?: string;
  before_image_url?: string;
  after_image_url?: string;
  before_image_label?: string;
  after_image_label?: string;
  created?: Date;
  enabled?: boolean;
  proAvailable?: boolean;
  onEditItem: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (gallery: GalleryType, before_image_file: null, after_image_file: null) => void;
}

const GalleryCard: React.FC<GalleryCardProps> = ({
  id,
  title,
  before_image_url,
  after_image_url,
  before_image_label,
  after_image_label,
  enabled,
  created,
  proAvailable,
  onUpdate,
  onEditItem,
  onDelete,
}: GalleryCardProps) => {
  const [isOpenConfirmMessage, setIsOpenConfirmMessage] = useState<boolean>(false);
  const [isActive, toggleIsActive] = useReducer((prevState) => !prevState, enabled!);

  useEffect(() => {
    if (enabled !== isActive) {
      const gallery = {
        id, enabled: isActive
      }
      onUpdate(gallery, null, null);
    }
  }, [isActive]);

  const handleDelete = () => {
    onDelete(id);
  }

  return (
    <>
      <div className="w-full p-6 shadow rounded-[26px] flex overflow-hidden gap-4 mb-4">
        {/* Caret Buttons */}
        <div className="cursor-pointer">
          <div><CaretUp /></div>
          <div><CaretDown /></div>
        </div>

        <div className="flex-grow flex flex-col">
          <div className="w-full flex items-center h-8 mb-4">
            {/* Title and Content */}
            <div className="flex-grow text-[14px] overflow-hidden">
              {/* Title Row */}
              <div className="flex flex-1 items-center truncate gap-2">
                <div className="text-primary-1 font-bold truncate">{title}</div>
                <button className="flex-shrink-0 enabled:hover:text-primary-1" onClick={() => onEditItem(id)} disabled={!proAvailable}>
                  <PencilSimple
                    size={18}
                  />
                </button>
              </div>

              {/* Content Row */}
            </div>

            {/* Trash Button */}
            <div className="flex items-center gap-2">
              <button onClick={() => setIsOpenConfirmMessage(true)} className="enabled:hover:text-red-700" disabled={!proAvailable}>
                <Trash size={20} />
              </button>
              <Switcher isChecked={isActive} onToggle={toggleIsActive} disabled={!proAvailable} />
            </div>
          </div>
          <div className="flex justify-around">
            <div className="w-2/5">
              <BlogImage
                src={before_image_url!}
                className="aspect-square rounded-[6px]" />
              <h6 className="text-[#989898] text-[16px] text-center mt-2">{before_image_label}</h6>
            </div>
            <div className="w-2/5">
              <BlogImage
                src={after_image_url!}
                className="aspect-square rounded-[6px]" />
              <h6 className="text-[#989898] text-[16px] text-center mt-2">{after_image_label}</h6>
            </div>
          </div>
        </div>
      </div>

      <ConfirmMessage
        description="Aure you sure you want to delete the gallery?"
        okText="Delete"
        isOpen={isOpenConfirmMessage}
        onClose={() => setIsOpenConfirmMessage(false)}
        onOk={handleDelete}
      />
    </>
  )
}

export default GalleryCard;