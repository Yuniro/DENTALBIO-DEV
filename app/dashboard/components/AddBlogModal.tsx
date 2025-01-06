// components/AddBlogModa.tsx

import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import LabeledInput from "./LabeledInput";
import LimitedTextArea from "./LimitedTextArea";
import FullRoundedButton from "@/app/components/Button/FullRoundedButton";
import ImageUploader from "./ImageUploader";
import { Info } from "@phosphor-icons/react/dist/ssr";
// import RichTextEditor from "@/app/components/TextEditor/RichTextEditor";
import { convertToSlug } from "@/utils/convertToSlug";

const RichTextEditor = dynamic(() => import('@/app/components/TextEditor/RichTextEditor'), { ssr: false });

interface ModalProps {
  group_id: string;
  username: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: { title: string; content: string; image: File | null; meta_title: string; meta_description: string }) => void;
}

type formDataProps = {
  title: string;
  content: string;
  meta_title: string;
  meta_description: string;
  slug: string;
  image: File | null;
  group_id: string;
}

const AddBlogModal: React.FC<ModalProps> = ({ group_id, username, isOpen, onClose, onSubmit }) => {
  const [prefix, setPrefix] = useState<string>(`https://dental.bio/${username}/blog/`);
  const [formData, setFormData] = useState<formDataProps>({
    title: "",
    content: "",
    meta_title: "",
    meta_description: "",
    slug: "",
    image: null,
    group_id: group_id
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    setFormData({
      title: "",
      content: "",
      meta_title: "",
      meta_description: "",
      slug: prefix,
      image: null,
      group_id
    });
    setSelectedImage(null);
    setIsUploading(false);
  }, [isOpen])

  const handleContentChange = (value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      content: value,
    }));
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let updateData = { [name]: value }
    if (name === "title") {
      if (value.includes(formData.meta_title))
        updateData = {
          ...updateData,
          meta_title: value
        };
      updateData = {
        ...updateData,
        slug: prefix + convertToSlug(value)
      };
    } else if (name === "content" && formData.meta_description === "") {
      updateData = {
        ...updateData,
        meta_description: value.slice(0, 200)
      };
    }
    setFormData((prevState) => ({
      ...prevState,
      ...updateData
    }));

  };

  const handleChangeSlug = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Ensure the input always starts with the prefix
    if (!value.startsWith(prefix)) {
      setFormData((prevState) => ({
        ...prevState,
        slug: prefix
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        slug: value
      }));
    }
  };

  const handleSubmit = () => {
    setIsUploading(true);
    onSubmit(formData);
  };

  const handleFileChange = (image: File) => {
    setSelectedImage(image);
    setFormData((prevState) => ({
      ...prevState,
      image
    }))
  }

  return (
    <>
      {isOpen && (
        <div
          className="modal-overlay overflow-auto fixed bg-[#00000080] z-10 left-0 top-0 right-0 bottom-0 flex justify-center items-center"
          onClick={onClose}
        >
          <div
            className="w-[600px] overflow-hidden flex flex-col rounded-[26px] bg-[#F3F3F1] p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="mb-4">Add New Blog</h4>
            <form action={handleSubmit}>
              <div className="max-h-[80vh] overflow-y-auto">
                <LabeledInput
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
                <RichTextEditor
                  value={formData.content}
                  onChange={handleContentChange} />
                {/* <LimitedTextArea
                  placeholder="Content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  limit={5000}
                  required
                /> */}
                <ImageUploader onFileChange={handleFileChange} text="Add Image (optional)" />
                <LabeledInput
                  label="Meta Title"
                  name="meta_title"
                  tooltip={true}
                  tooltipText="The Meta Title is the main heading that appears in search results. Keep it concise, under 60 characters."
                  value={formData.meta_title}
                  onChange={handleChange}
                >
                </LabeledInput>
                <LimitedTextArea
                  placeholder="Meta Description"
                  name="meta_description"
                  tooltip={true}
                  tooltipText="The Meta Description provides a summary for search engines. Keep it between 50-200 characters."
                  value={formData.meta_description}
                  onChange={handleChange}
                />
                <LabeledInput
                  label="URL"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChangeSlug}
                  required
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <FullRoundedButton isLoading={isUploading} type="submit">
                  Add Blog
                </FullRoundedButton>
                <FullRoundedButton type="button" buttonType="danger" onClick={onClose}>
                  Close
                </FullRoundedButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddBlogModal;
