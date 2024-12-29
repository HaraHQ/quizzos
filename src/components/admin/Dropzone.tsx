import useLocaleStore from '@/stores/locale';
import Image from 'next/image'
import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FaTimes } from 'react-icons/fa';

interface ImageDropzoneProps {
  image: string | null;
  setImage: (image: string | null) => void;
}

/**
 * NOTE: This component is used to upload an image for a quiz
 * NOTE: Since I can't use my previous bucket so this just sugar coat but not used
 * @param param0 
 * @returns 
 */
const ImageDropzone: React.FC<ImageDropzoneProps> = ({ image, setImage }) => {
  const l = useLocaleStore();
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Assuming the first file is the image
    const file = acceptedFiles[0];
    const reader = new FileReader();
    
    reader.onloadend = () => {
      setImage(reader.result as string); // Set the image URL to state
    };
    
    if (file) {
      reader.readAsDataURL(file); // Read the file as a data URL for preview
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Prevent the click from triggering the file input dialog
    setImage(null); // Clear the image
  };

  return (
    <div {...getRootProps()} className="h-[150px] w-full relative border-2 border-black rounded-lg">
      <input {...getInputProps()} className="z-[100]" />
      
      {image ? (
        <div className="relative w-full h-full">
          <Image
            src={image}
            alt="quiz image"
            className="rounded-lg object-cover"
            layout="fill"
          />
          <div
            className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex justify-center items-center z-[200] cursor-pointer"
            onClick={handleOverlayClick} // Call the handleOverlayClick function to stop propagation
          >
            <span className="text-white">
              <FaTimes className="text-3xl" />
            </span>
          </div>
        </div>
      ) : (
        <div className="h-full text-xs">
          {isDragActive ? (
            <div className="flex justify-center items-center h-full">{l.gt('dropHere')}</div>
          ) : (
            <div className="flex flex-col justify-center items-center h-full">
              <div>{l.gt('dragNDrop')}</div>
              <div>{l.gt('orClick')}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageDropzone;
