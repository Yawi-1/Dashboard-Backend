import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    tagline: { type: String, required: true },
    coverImage: { type: String, required: true }, 
    socialLinks: {
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      instagram: { type: String, default: "" },
    },
    ourStory: { type: String, required: true },
    ourMission: { type: String, required: true },
  },
  { timestamps: true }
);

const About =  mongoose.model("About", companySchema);

export default About; 