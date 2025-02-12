import {Router} from 'express'
import { upload } from '../middleware/multer.middleware.js';
import { addAbout, deleteAbout, getAbout } from '../controller/about.controller.js';

const router = Router();

router.post('/Create',upload.single('coverImage'),addAbout)
router.get('/getAbout',getAbout)
router.delete('/delete/:id',deleteAbout)

export default router;