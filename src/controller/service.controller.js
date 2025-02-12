import asyncHandler from '../utility/asyncHandlers.js';
import Services from '../models/service.model.js';
import { uploadOnCloudinary } from '../utility/cloudinary.js';
import fs from 'fs';

const createService = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    const file = req.file;

    if (!title || !description) {
        return res.status(400).json({
            success: false,
            message: "Missing service details"
        });
    }

    if (!file) {
        return res.status(400).json({
            success: false,
            message: "Service image is required!"
        });
    }

    try {
        const cloudinaryResponse = await uploadOnCloudinary(file);
        
        const newServices = await Services.create({
            title,
            description,
            coverImage: cloudinaryResponse?.url || '',
        });

        res.status(201).json({
            success: true,
            message: "Service created successfully!",
            services: newServices
        });                                               
    } catch (error) {
        console.error("Service creation error", error);
        res.status(500).json({
            success: false,
            message: "Error creating service",
            error: error.message
        });
    }
});

const getAllServices = asyncHandler(async (req, res) => {
    try {
        const services = await Services.find();
        
        res.status(200).json({
            success: true,
            count: services.length,
            services
        });
    } catch (error) {
        console.error("Error fetching services", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving services",
            error: error.message
        });
    }
});

const getServiceById = asyncHandler(async (req, res) => {
    try {
        const service = await Services.findById(req.params.id);
        
        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        res.status(200).json({
            success: true,
            service
        });
    } catch (error) {
        console.error("Error fetching service", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving service",
            error: error.message
        });
    }
});

const updateService = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const file = req.file;

    try {
        const service = await Services.findById(req.params.id);
        
        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        // Update title and description if provided
        if (title) service.title = title;
        if (description) service.description = description;

        // Handle image update if new file is uploaded
        if (file) {
            const mycloud = await uploadOnCloudinary(file.path);
            service.coverImage = mycloud?.url || '';
        }

        const updatedService = await service.save();

        res.status(200).json({
            success: true,
            message: "Service updated successfully!",
            service: updatedService
        });
    } catch (error) {
        console.error("Service update error", error);
        res.status(500).json({
            success: false,
            message: "Error updating service",
            error: error.message
        });
    }
});

const deleteService = asyncHandler(async (req, res) => {
    try {
        const service = await Services.findByIdAndDelete(req.params.id);
        
        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Service deleted successfully!"
        });
    } catch (error) {
        console.error("Service deletion error", error);
        res.status(500).json({
            success: false,
            message: "Error deleting service",
            error: error.message
        });
    }
});

export { 
    createService, 
    getAllServices, 
    getServiceById, 
    updateService, 
    deleteService 
};