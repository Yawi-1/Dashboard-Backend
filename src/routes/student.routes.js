import express from "express";
import { 
  createStudent, 
  getAllStudents, 
  getStudentById, 
  updateStudent, 
  deleteStudent 
} from "../controller/student.controller.js";

const router = express.Router();

router.post("/", createStudent);   // Create student
router.get("/", getAllStudents);   // Get all students
router.get("/:id", getStudentById); // Get student by ID
router.put("/:id", updateStudent); // Update student
router.delete("/:id", deleteStudent); // Delete student

export default router;
