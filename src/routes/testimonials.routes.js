import { Router } from "express";
import { addTestimonials, getTestimonials,getTestimonialById, deleteTestimonial } from "../controller/testimonials.controller.js";
import { upload } from "../middleware/multer.middleware.js";
const router = Router();

router.post('/Create',upload.single('image'), addTestimonials);
router.get('/getAllTestimonials',getTestimonials);
router.get('/getTestimonialById/:id',getTestimonialById);
router.delete('/deleteTestimonial/:id',deleteTestimonial)

export default router;