import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Job title is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Job description is required"],
    trim: true,
  },
  skills: {
    type: [String],
    required: [true, "Skills are required"],
    default: [],
  },
  jobType: {
    type: String,
    required: [true, "Job type is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastDate: {
    type: Date,
    required: [true, "Application last date is required"],
  },
});

const Job = mongoose.model("Job", jobSchema);
export default Job;
