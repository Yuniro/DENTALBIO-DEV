'use client'
import FullRoundedButton from "@/app/components/Button/FullRoundedButton";
import React, { useReducer, useState } from "react"
import AddGalleryModal from "./components/AddGalleryModal";

type AddNewGalleryProps = {
  onAdd: (gallery: any) => void;
}

const AddNewGallery: React.FC<AddNewGalleryProps> = ({
  onAdd,
}: AddNewGalleryProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
  }

  const uploadImage = async (image: File) => {
    const formData = new FormData();
    formData.append('bucket_name', 'gallery-images');
    formData.append('image', image);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    const result = await response.json();

    if (response.ok) {
      // console.log(`Image uploaded successfully! URL: ${result.publicUrl}`);
      return result.publicUrl;
    } else {
      console.log(`Error: ${result.error}`);
    }
  }

  const handleSubmit = async (formData: { title: string; before_image: File | null; after_image: File | null; before_image_label: string; after_image_label: string; }) => {
    const before_image_url = formData.before_image ? await uploadImage(formData.before_image) : "";
    const after_image_url = formData.after_image ? await uploadImage(formData.after_image) : "";
    // const image_url = '';

    const response = await fetch('/api/galleries', {
      method: 'POST',
      body: JSON.stringify({ ...formData, before_image_url, after_image_url }),
    });

    const result = await response.json();
    if (result.error) {
      console.log(result.error);
    } else {
      onAdd(result);

      closeModal();
    }
  };

  return (
    <>
      <FullRoundedButton onClick={openModal}>Add Gallery</FullRoundedButton>

      <AddGalleryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </>
  )
}

export default AddNewGallery;