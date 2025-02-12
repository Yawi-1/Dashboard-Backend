import {Router} from 'express';
import { createGallery,allGallery, deleteGallery } from '../controller/gallery.controller.js';
import {upload} from '../middleware/multer.middleware.js'
const router = Router();

router.post('/Create',upload.single('coverImage'),createGallery);
router.get('/getAllGallery',allGallery);
router.delete('/delete/:id',deleteGallery);

export default router;