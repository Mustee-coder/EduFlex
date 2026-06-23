import { v2 as cloudinary } from "cloudinary";



export const uploadImageToCloudinary = async (
  file,
  folder,
  height,
  quality
) => {
  try {
    if (!file) {
      throw new Error("No file provided for upload");
    }

    const filePath = file.tempFilePath || file.path;

    const options = {
      folder,
      resource_type: "auto",
    };

    if (height) options.height = height;
    if (quality) options.quality = quality;

    return await cloudinary.uploader.upload(filePath, options);
  } catch (error) {
    console.log("Cloudinary upload error:", error.message);
    throw error;
  }
};

// Delete resource from Cloudinary
export const deleteResourceFromCloudinary = async (url) => {
  if (!url) return;

  try {
    // Extract path after /upload/
    const splitUrl = url.split("/upload/");

    if (splitUrl.length < 2) return;

    let publicId = splitUrl[1];

    // remove version (v12345/)
    publicId = publicId.replace(/^v\d+\//, "");

    // remove file extension
    publicId = publicId.split(".")[0];

    const result = await cloudinary.uploader.destroy(publicId);

    console.log("Deleted from Cloudinary:", publicId);

    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error.message);
    throw error;
  }
};