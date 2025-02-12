import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    coverImage:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

const Gallery = mongoose.model('Gallery',gallerySchema);

export default Gallery;