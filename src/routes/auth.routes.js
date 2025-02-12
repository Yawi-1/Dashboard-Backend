import express from 'express';
import {
  // createStaff,
  // staffLogin,
  // getAllStaff,
  // updateStaff,
  // deleteStaff,
  adminSignUp,
  adminLogin,
  adminLogout,
  checkAuth
} from "../controller/auth.controller.js";

const router = express.Router();

// router.post('/create', createStaff);           // Create Staff
// router.post('/stafflogin', staffLogin);             // Staff Login
// router.get('/', getAllStaff);                  // Get All Staff
// router.put('/:id', updateStaff);               // Update Staff by _id
// router.delete('/:id', deleteStaff); 
router.post('/signup',adminSignUp)         // Delete Staff by _id
router.post('/login',adminLogin)         // Delete Staff by _id
router.get('/logout',adminLogout)         // Delete Staff by _id
router.get('/check-auth',checkAuth)         // Delete Staff by _id

export default router;
