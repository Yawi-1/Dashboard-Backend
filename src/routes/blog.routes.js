import { Router } from "express";
 
import { upload } from '../middleware/multer.middleware.js';
import { createBlog, deleteBlog, getAllBlogs, getBlogById, updateBlog } from "../controller/blog.controller.js";

const router = Router()


router.post('/Create', upload.single('coverImage'), createBlog);



// Additional  routes

router.route("/getAllBlogs").get(getAllBlogs);

//  /:id    requred  then  hit 

router.route("/getBlogById/:id").get(getBlogById); //     /:Id
router.route("/updateBlog/:id").put(updateBlog);    //    /:Id
router.route("/deleteBlog/:id").delete(deleteBlog);  //   /:Id



export default router; 