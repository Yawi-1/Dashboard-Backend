import Testimonials from "../models/testimonial.model.js";
import { uploadOnCloudinary } from "../utility/cloudinary.js";

export const addTestimonials = async (req, res) => {
  try {
    const  image  = req.file;
    const { name, description, role, rating } = req.body;
    if(!image){
        return res.status(400).json({ message: "Please upload an image" });
    }
    const cloudinaryResponse = await uploadOnCloudinary(image)

    const testimonial = new Testimonials({
      name,
      description,
      role,
      rating,
      image :cloudinaryResponse?.url || ''
    });
    await testimonial.save();
    res.status(201).json({ message: "testimonial added successfully", data : testimonial,success:true });
  } catch (error) {
    res.status(500).json({ message: error.message, success:false });
  }
};


export const getTestimonials = async (req, res) => {
  try {
      const testimonials = await Testimonials.find({});
      if(!testimonials){
        return res.status(404).json({ message: "No testimonials found", success:false });
      }
      res.status(200).json({ message: "testimonial fetched successfully", data: testimonials,success:true})
  } catch (error) {
    res.status(500).json({ message: error.message, success:false });
  }
}

export const getTestimonialById = async (req,res)=>{
    try {
      const {id} = req.params;
      const testimonial = await Testimonials.findById(id);
      if(!testimonial){
        return res.status(404).json({ message: "testimonial not found", success:false });
      }
      res.status(200).json({ message: "testimonial fetched successfully", data: testimonial, success:true})
    } catch (error) {
      res.status(500).json({message:error.message,success:false})
    }
}

export const deleteTestimonial = async(req,res)=>{
  try {
    const {id} = req.params;
    const deletedTestimonial = await Testimonials.findByIdAndDelete(id);
    if(!deletedTestimonial){
      return res.status(404).json({ message: "testimonial not found", success:false });
      }
      res.status(200).json({ message: "testimonial deleted successfully", success:true,data:deletedTestimonial._id})
  } catch (error) {
    res.status(500).json({ message: error.message, success:false });
  }
}