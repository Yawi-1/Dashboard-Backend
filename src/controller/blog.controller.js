import asyncHandler from "../utility/asyncHandlers.js";
import Blog from "../models/blog.model.js";
import { uploadOnCloudinary } from "../utility/cloudinary.js";
// import { deleteFromCloudinary } from "../utility/cloudinary.js";

// Create a new blog
const createBlog = asyncHandler(async (req, res) => {
    const { name, category, status, date, view, title, description, content } = req.body;
    const file = req.file;

    if (!category || !title || !description || !content) {
        return res.status(400).json({
            success: false,
            message: "Missing blog details"
        });
    }

    if (!file) {
        return res.status(400).json({
            success: false,
            message: "Blog cover image is required!"
        });
    }

    try {
        const mycloud = await uploadOnCloudinary(file);
        
        const newBlog = await Blog.create({
            category,
            title,
            description,
            content,
            coverImage: mycloud?.url || '',
            coverImagePublicId: mycloud?.public_id || '',
        });

        res.status(201).json({
            success: true,
            message: "Blog created successfully!",
            blog: newBlog
        });                                               
    } catch (error) {
        console.error("Blog creation error", error);
        res.status(500).json({
            success: false,
            message: "Error creating blog",
            error: error.message
        });
    }
});

// Read all blogs
const getAllBlogs = asyncHandler(async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            category, 
            status, 
            sortBy = 'createdAt', 
            sortOrder = 'desc' 
        } = req.query;

        const query = {};
        if (category) query.category = category;
        if (status) query.status = status;

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const blogs = await Blog.find(query)
            .sort(sortOptions)
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        const total = await Blog.countDocuments(query);

        res.status(200).json({
            success: true,
            message: "Blogs retrieved successfully",
            data: {
                blogs,
                totalBlogs: total,
                currentPage: Number(page),
                totalPages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        console.error("Error retrieving blogs", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving blogs",
            error: error.message
        });
    }
});

// Read a single blog by ID
const getBlogById = asyncHandler(async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        // Increment view count
        await blog.save();

        res.status(200).json({
            success: true,
            message: "Blog retrieved successfully",
            blog
        });
    } catch (error) {
        console.error("Error retrieving blog", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving blog",
            error: error.message
        });
    }
});

// Update a blog
const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {  category,  title, description, content } = req.body;
    const file = req.file;

    try {
        // Find the existing blog
        const existingBlog = await Blog.findById(id);

        if (!existingBlog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        // Optional: Upload new cover image if provided
        let cloudinaryResult = null;
        if (file) {
            // Delete existing image from Cloudinary if it exists
            if (existingBlog.coverImagePublicId) {
                await deleteFromCloudinary(existingBlog.coverImagePublicId);
            }

            // Upload new image
            cloudinaryResult = await uploadOnCloudinary(file);
        }

        // Update blog details
        const updateData = {
            category: category || existingBlog.category,
            title: title || existingBlog.title,
            description: description || existingBlog.description,
            content: content || existingBlog.content,
        };

        // Update cover image if new image was uploaded
        if (cloudinaryResult) {
            updateData.coverImage = cloudinaryResult.url || existingBlog.coverImage;
            updateData.coverImagePublicId = cloudinaryResult.public_id || existingBlog.coverImagePublicId;
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            blog: updatedBlog
        });
    } catch (error) {
        console.error("Error updating blog", error);
        res.status(500).json({
            success: false,
            message: "Error updating blog",
            error: error.message
        });
    }
});

// Delete a blog
const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        // Find the blog to get the Cloudinary public ID
        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        // Delete image from Cloudinary if it exists
        if (blog.coverImagePublicId) {
            await deleteFromCloudinary(blog.coverImagePublicId);
        }

        // Delete the blog from the database
        await Blog.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Blog deleted successfully",
            blog : blog
        });
    } catch (error) {
        console.error("Error deleting blog", error);
        res.status(500).json({
            success: false,
            message: "Error deleting blog",
            error: error.message
        });
    }
});

export { 
    createBlog, 
    getAllBlogs, 
    getBlogById, 
    updateBlog, 
    deleteBlog 
};