import Section from "../models/section.js";
import SubSection from "../models/subSection.js";
import cloudinary from "../config/cloudinary.js";
import { uploadImageToCloudinary, deleteResourceFromCloudinary } from "../utils/imageUploader.js";

//  CREATE SUBSECTION 
export const createSubSection = async (req, res) => {
  try {
    const { title, description, sectionId } = req.body;
    const videoFile = req.files?.video;

    console.log("SECTION ID:", sectionId);

    if (!title || !description || !sectionId || !videoFile) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const section = await Section.findById(sectionId);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    // ✅ VIDEO UPLOAD FIX
    const uploadResult = await cloudinary.uploader.upload(
      videoFile.tempFilePath,
      {
        resource_type: "video",
        folder: process.env.FOLDER_NAME,
      }
    );

    const newSubSection = await SubSection.create({
      title,
      description,
      videoUrl: uploadResult.secure_url,
      timeDuration: Math.round(uploadResult.duration || 0),
      section: sectionId,
    });

    await Section.findByIdAndUpdate(sectionId, {
      $push: { subSections: newSubSection._id },
    });

    const course = await Course.findOne({
      sections: sectionId,
    });

    if (course) {
      await calculateCourseDuration(course._id);
    }

    const updatedSection = await Section.findById(sectionId).populate(
      "subSections"
    );

    return res.status(200).json({
      success: true,
      data: updatedSection,
      message: "SubSection created successfully",
    });

  } catch (error) {
    console.log("CREATE SUBSECTION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// update subsection

export const updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body;

    // validation
    if (!subSectionId) {
      return res.status(400).json({
        success: false,
        message: "SubSection ID required",
      });
    }

    const subSection = await SubSection.findById(subSectionId);

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    // update text fields
    if (title) subSection.title = title;
    if (description) subSection.description = description;

    // update video if exists
    if (req.files?.video) {
      const videoFile = req.files.video;

      const uploadResult = await uploadImageToCloudinary(
        videoFile,
        process.env.FOLDER_NAME
      );

      subSection.videoUrl = uploadResult.secure_url;

      subSection.timeDuration =
        uploadResult.duration || subSection.timeDuration || 0;
    }

    await subSection.save();

    // update course duration (IMPORTANT)
    const course = await Course.findOne({
  sections: sectionId,
});

console.log("COURSE FOUND:", course);

if (course) {
  await calculateCourseDuration(course._id);
}

    // return updated section
    const updatedSection = await Section.findById(sectionId).populate(
      "subSections"
    );

    return res.status(200).json({
      success: true,
      data: updatedSection,
      message: "SubSection updated successfully",
    });
  } catch (error) {
    console.log("UPDATE SUBSECTION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Delete subsection 
export const deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;

    // validation
    if (!subSectionId || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "IDs required",
      });
    }

    // find subsection
    const subSection = await SubSection.findById(subSectionId);

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    // delete video from cloudinary (safe)
    if (subSection.videoUrl) {
      try {
        await deleteResourceFromCloudinary(subSection.videoUrl);
      } catch (err) {
        console.log("Cloudinary delete failed:", err.message);
      }
    }

    // remove from section
    await Section.findByIdAndUpdate(sectionId, {
      $pull: { subSections: subSectionId },
    });

    // delete subsection
    await SubSection.findByIdAndDelete(subSectionId);

    // recalculate course duration (IMPORTANT FIX)
    const course = await Course.findOne({
  sections: sectionId,
});

console.log("COURSE FOUND:", course);

if (course) {
  await calculateCourseDuration(course._id);
}

    // return updated section
    const updatedSection = await Section.findById(sectionId).populate(
      "subSections"
    );

    return res.status(200).json({
      success: true,
      data: updatedSection,
      message: "SubSection deleted successfully",
    });
  } catch (error) {
    console.log("DELETE SUBSECTION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
