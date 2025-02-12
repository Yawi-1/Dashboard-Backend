import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    course: { 
      type: String, 
      enum: ["Cyber Security", "MERN Stack", "Data Science", "AI & ML"], 
      default: "Cyber Security",
      required: true
    },
    age: { type: Number, required: true },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);
export default Student;
