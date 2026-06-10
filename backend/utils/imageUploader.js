import { v2 as cloudinary } from "cloudinary";

export const uploadImageToCloudinary = async (file, folder, height, quality) => {
  try {
    if (!file || !file.tempFilePath) {
      throw new Error("No file provided for upload");
    }

    const options = {
      folder,
      resource_type: "auto",
    };

    if (height) options.height = height;
    if (quality) options.quality = quality;

    return await cloudinary.uploader.upload(file.tempFilePath, options);
  } catch (error) {
    console.log("Cloudinary upload error:", error.message);
    throw error;
  }
};

// Delete resource from Cloudinary
export const deleteResourceFromCloudinary = async (url) => {
  if (!url) return;

  try {
    // extract public_id from URL
    const parts = url.split("/");
    const fileWithExt = parts[parts.length - 1];
    const publicId = fileWithExt.split(".")[0];

    const result = await cloudinary.uploader.destroy(publicId);

    console.log("Deleted:", publicId);
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw error;
  }
};