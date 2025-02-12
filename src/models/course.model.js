import mongoose from "mongoose";

const courseSchema = new mongoose.Schema (
    {
        title: {
            type: String,
            required: true
        },
        subject: {
            type: String,
            required: true
        },
        courseCode: {
            type: String,
            unique: true,
        },
        duration: {
            type: String,
            required: true
        },
        courseFees: {
            type: Number,
            required: true
        },
        
        discountendfees: {
            type: Number,
            min: 0,
            max: 500
        },
        minFeesToPay: {
            type: Number,
            required: true
        },
        coverImage: {
            type: String,  // cloudinary
        },
        domain: {
            type: String,
            required: true
        },
        curriculum: {
            type: String,
        },
        eligibilityCriteria: {
            type: String,
        },

},  {
    timestamps: true
})

 const Course = mongoose.model("Course", courseSchema)

  export default  Course;

