import { Router } from "express";
import { upload } from '../middleware/multer.middleware.js'
import { createCourse, deleteCourse, getAllCourse, getSingleCourse, updateCourse } from "../controller/course.controller.js";

const router = Router();

// Error handling middleware for file upload
router.post('/Create', upload.single('coverImage'), createCourse);


// Additional  routes   

router.route("/getAllCourse").get(getAllCourse);

//  /:id  requred  then  hit 

router.route("/getSingleCourse/:id").get(getSingleCourse); //     /:Id
router.put('/updateCourse/:id',upload.single('coverImage'),updateCourse)
// router.route("/updateCourse/:id").put(updateCourse);    //    /:Id
router.route("/deleteCourse/:id").delete(deleteCourse);  //   /:Id



export default router;