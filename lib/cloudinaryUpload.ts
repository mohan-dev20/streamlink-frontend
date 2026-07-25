import axios from "axios";

export const uploadToCloudinary = async (
  file: File,
  folder: string,
  onProgress?: (progress: number) => void
) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
  );
  formData.append("folder", folder);

  const response = await axios.post(
  `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
  formData,
  {
    timeout: 0,

    onUploadProgress: (event) => {
      if (!event.total) return;

      const percent = Math.round(
        (event.loaded * 100) / event.total
      );

      if (onProgress) {
        onProgress(percent);
      }
    },
  }
);

  return response.data.secure_url;
};