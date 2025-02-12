import Job from "../models/job.model.js";

// Add Job
export const addJob = async (req, res) => {
  try {
    const { title, description, skills, jobType, lastDate } = req.body;

    // Input validation
    if (!title || !description || !skills?.length || !jobType || !lastDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const job = await Job.create(req.body);
    res.status(201).json({ message: "Job added successfully", job });
  } catch (error) {
    console.error("Error adding job:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get All Jobs
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({});
    res.status(200).json({ message: "All jobs fetched successfully", jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete Job
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const deletedJob  = await Job.findByIdAndDelete(id);
    res.status(200).json({ message: "Job deleted successfully", job:deletedJob });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
