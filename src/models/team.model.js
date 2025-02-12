import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({

    coverImage: {
        type: String,    // cloudinary 
    },
    name: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    yearOfExperience: { 
        type: Number,
        required: false
    }
 }, {
     timestamps: true
})

 const Team = mongoose.model("Team", teamSchema)
 
 export default Team;
