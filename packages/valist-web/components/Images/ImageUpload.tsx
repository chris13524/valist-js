import { ChangeEvent, useState } from "react";
import { SetUseState } from "../../utils/Account/types";

interface ImageUploadProps {
  text: string
  setImage: SetUseState<string>
}

export default function ImageUpload(props: ImageUploadProps) {
  const [imageObject, setImageObject] = useState<File | null>(null);
  const [imagePrev, setImagePrev] = useState<string| null>(null);

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target?.files) {
      props.setImage(URL.createObjectURL(e.target.files[0]));
      setImageObject(e.target.files[0]);
    };
  };

  return (
    <div className="max-w-screen-sm">
      <label className="w-48 flex justify-center py-2 px-4 border border-transparent rounded-md 
        shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none 
        focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-4 mx-auto">
          {props.text}
        <input type='file' onChange={(e) => handleImage(e)} className="hidden" />
      </label>
    </div>
  )
}