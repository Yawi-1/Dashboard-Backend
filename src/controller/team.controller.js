import asyncHandler from '../utility/asyncHandlers.js';
import Team from '../models/team.model.js';
import { uploadOnCloudinary } from '../utility/cloudinary.js';
import fs from 'fs';

// Create Team (existing implementation)
const createTeam = asyncHandler(async (req, res) => {
    const { name, designation, yearOfExperience } = req.body;
    const file = req.file;

    if (!name || !designation || !yearOfExperience) {
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
        
        const newTeam = await Team.create({
            name,
            designation,
            yearOfExperience,
            coverImage: cloudinaryResponse?.url || '',
        });

        res.status(201).json({
            success: true,
            message: "Service created successfully!",
            Team: newTeam
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

// Read All Team Members
const getAllTeamMembers = asyncHandler(async (req, res) => {
    try {
        const teamMembers = await Team.find();
        
        res.status(200).json({
            success: true,
            count: teamMembers.length,
            teamMembers
        });
    } catch (error) {
        console.error("Error fetching team members", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving team members",
            error: error.message
        });
    }
});

// Read Single Team Member
const getTeamMemberById = asyncHandler(async (req, res) => {
    try {
        const teamMember = await Team.findById(req.params.id);
        
        if (!teamMember) {
            return res.status(404).json({
                success: false,
                message: "Team member not found"
            });
        }
        
        res.status(200).json({
            success: true,
            teamMember
        });
    } catch (error) {
        console.error("Error fetching team member", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving team member",
            error: error.message
        });
    }
});

// Update Team Member
const updateTeamMember = asyncHandler(async (req, res) => {
    const { name, designation, yearOfExperience } = req.body;
    const file = req.file;

    try {
        const teamMember = await Team.findById(req.params.id);
        
        if (!teamMember) {
            return res.status(404).json({
                success: false,
                message: "Team member not found"
            });
        }

        // Update text fields
        if (name) teamMember.name = name;
        if (designation) teamMember.designation = designation;
        if (yearOfExperience) teamMember.yearOfExperience = yearOfExperience;

        // Update image if new file is uploaded
        if (file) {
            const mycloud = await uploadOnCloudinary(file.path);
            teamMember.coverImage = mycloud?.url || '';
        }

        const updatedTeamMember = await teamMember.save();

        res.status(200).json({
            success: true,
            message: "Team member updated successfully",
            teamMember: updatedTeamMember
        });
    } catch (error) {
        console.error("Error updating team member", error);
        res.status(500).json({
            success: false,
            message: "Error updating team member",
            error: error.message
        });
    }
});

// Delete Team Member
const deleteTeamMember = asyncHandler(async (req, res) => {
    try {
        const teamMember = await Team.findByIdAndDelete(req.params.id);
        
        if (!teamMember) {
            return res.status(404).json({
                success: false,
                message: "Team member not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Team member deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting team member", error);
        res.status(500).json({
            success: false,
            message: "Error deleting team member",
            error: error.message
        });
    }
});

export { 
    createTeam, 
    getAllTeamMembers, 
    getTeamMemberById, 
    updateTeamMember, 
    deleteTeamMember 
};