import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()  
// log environment variable for debugging 

// console.log("Cloudinary Env Variables:", {
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET ? 'Present' : 'Missing'
// });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const uploadOnCloudinary = async (file) => {
    try {
        // Extract the local file path from the Multer file object
        const localFilePath = file.path;

        if (!localFilePath) return null;

        // Upload to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        // Remove local file after successful upload
        fs.unlinkSync(localFilePath);

        return response;
    } catch (error) {
        // If upload fails, try to remove the local file
        if (file.path) {
            try {
                fs.unlinkSync(file.path);
            } catch (unlinkError) {
                console.error('Error removing local file:', unlinkError);
            }
        }
        console.error('Cloudinary upload error:', error);
        return null;
    }

}

export { uploadOnCloudinary }
