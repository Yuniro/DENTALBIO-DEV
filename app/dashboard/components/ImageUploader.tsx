import { Image, Upload } from '@phosphor-icons/react/dist/ssr';
import React, { useEffect, useState } from 'react';

type ImageUploaderProps = {
  onFileChange: (image: File) => void;
  image_url?: string;
  id?: string;
  text?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onFileChange,
  image_url,
  id,
  text,
}: ImageUploaderProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(image_url!);
  const [valid, setValid] = useState<boolean>(false);

  const handleError = () => {
    setValid(false); // Replace with fallback image
  };

  const handleLoad = () => {
    setValid(true); // Replace with fallback image
  };

  useEffect(() => {
    if (image_url) {
      setImagePreview(image_url!);
    } else
      setValid(false);
  }, [image_url])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileChange(file);
      setImagePreview(URL.createObjectURL(file)); // Preview the image
    }
  };

  return (
    <div className='mb-4'>
      <label htmlFor={id || 'uploader'} className='w-full cursor-pointer'>
        {/* <button type="button"> */}
        <div className={`relative bg-black rounded-lg group ${!valid && "hidden"}`}>
          <img
            src={imagePreview!}
            alt="preview"
            className="w-full transition-all ease-in-out hover:opacity-50 rounded-lg"
            onError={handleError} // Handle invalid image error
            onLoad={handleLoad}
          />
        </div>
        {!valid && (
          <div className='w-full h-12 flex justify-center items-center bg-white border-[#BBB] rounded-[26px]'><Image size={22} />&nbsp;&nbsp;{text || "Add Image"}</div>
        )}
        {/* </button> */}
      </label>
      <input
        name='uploader'
        id={id || 'uploader'}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImageUploader;
