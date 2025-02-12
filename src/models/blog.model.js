import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
    {
     category: {
        type: String,
        required: true
     },
     title: {
        type: String,
        required: true
     },
     description: {
        type: String,
        required: true
     },
     coverImage: {
        type: String,
        
     },
     content: {
        type: String,
        required: true
     }

}, {
    timestamps: true
});

 const Blog = mongoose.model('Blog', blogSchema);

 export default Blog;
