import { Router } from "express";
import { addJob, deleteJob, getJobs } from "../controller/job.controller.js";
const router = Router();

router.post("/Create", addJob);
router.get("/getAllJobs", getJobs);
router.delete("/delete/:id", deleteJob);

export default router;
