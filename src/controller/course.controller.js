import asyncHandler from '../utility/asyncHandlers.js'
import Course from '../models/course.model.js'
import { uploadOnCloudinary } from '../utility/cloudinary.js'
import mongoose from 'mongoose'

// Create Course 
const createCourse = asyncHandler(async (req, res) => {
    const { 
        title, 
        subject, 
        courseCode, 
        duration, 
        courseFees, 
        discountendfees,
        minFeesToPay, 
        domain, 
        curriculum, 
        eligibilityCriteria
    } = req.body;
        
    const file = req.file;

    // Validate required fields
    if (!title || !subject || !courseCode || !duration || !courseFees || !discountendfees ||
         !minFeesToPay || !domain || !curriculum || !eligibilityCriteria) {
        return res.status(400).json({
            success: false,
            message: "Missing required course details"
        });
    }

    // Validate file upload
    if (!file) {
        return res.status(400).json({
            success: false,
            message: "Cover image is required!"
        });
    }

    try {
        // Upload to Cloudinary
        const cloudinaryResponse = await uploadOnCloudinary(file);

        // Create new course
        const newCourse = await Course.create({
            title,
            subject,
            courseCode,
            duration,
            courseFees,
            discountendfees,
            minFeesToPay,
            domain,
            curriculum,
            eligibilityCriteria,
            coverImage: cloudinaryResponse?.url || '',
        });

        res.status(201).json({
            success: true,
            message: "Course created successfully!!",
            Course: {
                title: newCourse.title,
                subject: newCourse.subject,
                courseCode: newCourse.courseCode,
                duration: newCourse.duration,
                courseFees: newCourse.courseFees,
                discountendfees: newCourse.discountendfees,
                minFeesToPay: newCourse.minFeesToPay,
                domain: newCourse.domain,
                curriculum: newCourse.curriculum,
                eligibilityCriteria: newCourse.eligibilityCriteria,
                coverImage: newCourse.coverImage
            }
        });
    } catch (error) {
        console.error("Course creation error:", error);
        res.status(500).json({
            success: false,
            message: "Error creating course",
            error: error.message
        });
    }
});

// Get All Courses
const getAllCourse = asyncHandler(async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            subject, 
            domain,
            sortBy = 'createdAt',
            sortOrder = 'desc' 
        } = req.query;

        // Build query filter
        const filter = {};
        if (subject) filter.subject = subject;
        if (domain) filter.domain = domain;

        // Sorting
        const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

        // Pagination
        const skip = (page - 1) * limit;

        // Fetch courses
        const courses = await Course.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

        // Total courses for pagination
        const total = await Course.countDocuments(filter);

        res.status(200).json({
            success: true,
            message: "Courses retrieved successfully",
            pagination: {
                totalCourses: total,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                coursesPerPage: courses.length
            },
            courses
        });
    } catch (error) {
        console.error("Error retrieving courses:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving courses",
            error: error.message
        });
    }
});

// Get Single Course by ID
const getSingleCourse = asyncHandler(async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Course retrieved successfully",
            course
        });
    } catch (error) {
        console.error("Error retrieving course:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving course",
            error: error.message
        });
    }
});

// Update Course
const updateCourse = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid course ID" });
        }

        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        // Handle file upload
        if (req.file) {
            const cloudinaryResponse = await uploadOnCloudinary(req.file);
            updateData.coverImage = cloudinaryResponse?.url || course.coverImage;
        }

        // Update course
        const updatedCourse = await Course.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        res.status(200).json({ success: true, message: "Course updated successfully", course: updatedCourse });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating course", error: error.message });
    }
});


// Delete Course
const deleteCourse = asyncHandler(async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Course deleted successfully",
            deletedCourse: {
                id: course._id,
                title: course.title
            }
        });
    } catch (error) {
        console.error("Course deletion error:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting course",
            error: error.message
        });
    }
});

export { 
    createCourse, 
    getAllCourse, 
    getSingleCourse, 
    updateCourse, 
    deleteCourse 
};