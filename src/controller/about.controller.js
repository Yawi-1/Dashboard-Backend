import About from "../models/about.model.js";
import { uploadOnCloudinary } from "../utility/cloudinary.js";

export const addAbout = async (req, res) => {
  try {
    const { companyName, tagline, ourStory, ourMission } = req.body;
    let socialLinks = req.body.socialLinks;
    const file = req.file;

    if (!companyName || !tagline || !ourStory || !ourMission) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!file) {
      return res.status(400).json({ error: "Cover image is required" });
    }

    // Parse socialLinks since FormData sends it as a string
    if (typeof socialLinks === "string") {
      try {
        socialLinks = JSON.parse(socialLinks);
      } catch (error) {
        return res.status(400).json({ error: "Invalid socialLinks format" });
      }
    }

    const cloudinaryResponse = await uploadOnCloudinary(file);
    const coverImage = cloudinaryResponse?.url || "";

    const newAbout = new About({
      companyName,
      tagline,
      coverImage,
      socialLinks,
      ourStory,
      ourMission,
    });

    await newAbout.save();
    res.status(201).json({ message: "Company profile added successfully", about: newAbout });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Get all company profiles
export const getAbout = async (req, res) => {
  try {
    const aboutData = await About.find({});
    res.status(200).json({ message: "Company profiles retrieved successfully", about: aboutData });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteAbout = async (req,res)=>{
  try {
    const {id} = req.params;

    const deletedAbout = await About.findByIdAndDelete(id);
    res.status(200).json({ message: "Company profile deleted successfully", about:deletedAbout });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    
  }
}