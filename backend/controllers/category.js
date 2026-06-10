import Category from "../models/category.js";
import Course from "../models/course.js";

//  CREATE CATEGORY 
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const category = await Category.create({
      name,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while creating category",
      error: error.message,
    });
  }
};

//  DELETE CATEGORY 
export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.body;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      });
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await Category.findByIdAndDelete(categoryId);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while deleting category",
      error: error.message,
    });
  }
};

//  SHOW ALL CATEGORIES 
export const showAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find(
      {},
      { name: 1, description: 1 }
    ).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: allCategories,
      message: "Categories fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching categories",
      error: error.message,
    });
  }
};

//  CATEGORY PAGE DETAILS 
export const getCategoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      });
    }

    // selected category
    const selectedCategory = await Category.findById(categoryId);

    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // courses under this category (FROM COURSE MODEL - FIXED)
    const categoryCourses = await Course.find({
      category: categoryId,
      status: "Published",
    })
      .populate("instructor")
      .populate("ratingAndReviews");

    // other categories
    const otherCategories = await Category.find({
      _id: { $ne: categoryId },
    });

    let differentCategory = null;

    if (otherCategories.length > 0) {
      const randomIndex = Math.floor(
        Math.random() * otherCategories.length
      );

      const randomCategory = otherCategories[randomIndex];

      differentCategory = await Course.find({
        category: randomCategory._id,
        status: "Published",
      }).populate("instructor");
    }

    // top selling courses
    const mostSellingCourses = await Course.find({
      status: "Published",
    })
      .populate("instructor")
      .limit(10);

    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        categoryCourses,
        differentCategory,
        mostSellingCourses,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};