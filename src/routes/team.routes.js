import { Router } from "express";
 
import { upload } from '../middleware/multer.middleware.js';
import { createTeam, deleteTeamMember, getAllTeamMembers, getTeamMemberById, updateTeamMember } from "../controller/team.controller.js";

const router = Router()

router.post('/Create', upload.single('coverImage'), createTeam);

// Additional  routes

router.route("/getAllTeamMembers").get(getAllTeamMembers);

//  /:id    requred  then  hit 

router.route("/getTeamMemberById/:id").get(getTeamMemberById); //     /:Id
router.route("/updateTeamMember/:id").put(updateTeamMember);    //    /:Id
router.route("/deleteTeamMember/:id").delete(deleteTeamMember);  //   /:Id


export default router ;