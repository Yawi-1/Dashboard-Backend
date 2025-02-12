import Gallery from "../models/gallery.model.js";
import { uploadOnCloudinary } from "../utility/cloudinary.js";

export const createGallery = async (req, res) => {
  try {
    const { title } = req.body;
    const file = req.file;

    if (!title) {
      return res.status(400).json({ message: "Please enter title" });
    }
    if (!file) {
      return res.status(400).json({ message: "Please select a cover image" });
    }
    const cloudinaryResponse = await uploadOnCloudinary(file);

    const newGallery = await Gallery.create({
      title,
      coverImage: cloudinaryResponse?.url || "",
    });
    return res
      .status(201)
      .json({ message: "Gallery added successfully", gallery : newGallery });
  } catch (error) {
    return res.status(500).json({ message: "Error adding gallery", error });
  }
};


export const allGallery  = async(req,res)=>{
    try {
        const gallery = await Gallery.find({});
        return res.status(200).json({ message :" All galleries fetched successfully", gallery });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching galleries", error });
    }
}

export const deleteGallery = async(req,res)=>{
    try {
        const {id} = req.params;
        const deletedGallery = await Gallery.findByIdAndDelete(id);
        if(!deleteGallery){
            return res.status(404).json({ message: "Gallery not found" });
        }
        return res.status(200).json({ message: "Gallery deleted successfully", gallery : deletedGallery });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting gallery", error });
    }
}