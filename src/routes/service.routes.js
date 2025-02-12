import { Router } from "express";
import { createService, deleteService, getAllServices, getServiceById, updateService } from '../controller/service.controller.js';
import { upload } from '../middleware/multer.middleware.js';


const router = Router()

// Updated route handling (service.routes.js)
router.post('/Create', upload.single('coverImage'), createService);

// Additional  routes   

router.route("/getAllService").get(getAllServices);

//  /:id  requred  then  hit 

router.route("/getServiceById/:id").get(getServiceById); //     /:Id
router.route("/updateService/:id").put(updateService);    //    /:Id
router.route("/deleteService/:id").delete(deleteService);  //   /:Id





export default router;