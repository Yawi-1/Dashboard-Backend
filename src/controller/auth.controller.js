import Staff from '../models/staff.model.js';
import Admin from '../models/admin.model.js'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'

// Account Creation
export const createStaff = async (req, res) => {
  try {
    const { name, staffId, role, password } = req.body;

    // Check if all required fields are provided
    if (!name || !staffId || !role || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the staffId already exists
    const staffExists = await Staff.findOne({ staffId });
    if (staffExists) {
      return res.status(400).json({ message: 'Staff ID already exists' });
    }

    // Create a new staff without hashing the password
    const newStaff = new Staff({
      name,
      staffId,
      role,
      password, // Storing plain text password
    });

    // Save the staff to the database
    await newStaff.save();

    res.status(201).json({ message: 'Staff created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating staff', error: error.message });
  }
};

// Staff Login
export const staffLogin = async (req, res) => {
  try {
    const { staffId, password } = req.body;

    if (!staffId || !password) {
      return res.status(400).json({ message: 'Both ID and password are required' });
    }

    // Find staff by staffId
    const staff = await Staff.findOne({ staffId });
    if (!staff) {
      return res.status(404).json({ message: 'Invalid credentials' });
    }

    // Compare the plain text password directly
    if (staff.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ staffId: staff.staffId }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      staff: { name: staff.name, role: staff.role, staffId: staff.staffId },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Get All Staff
export const getAllStaff = async (req, res) => {
  try {
    const staffMembers = await Staff.find();
    res.status(200).json(staffMembers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving staff', error: error.message });
  }
};

// Update Staff by MongoDB unique _id
export const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;  // MongoDB _id of the staff to be updated
    const { name, role, password } = req.body;

    // Check if _id is provided
    if (!id) {
      return res.status(400).json({ message: 'Staff _id is required' });
    }

    // Prepare the update data
    const updateData = {};
    if (name) updateData.name = name;
    if (role) updateData.role = role;
    if (password) updateData.password = password; // Use plain text password

    // Use MongoDB unique _id to find and update the staff
    const updatedStaff = await Staff.findByIdAndUpdate(
      id, // This is the MongoDB unique _id
      { $set: updateData },
      { new: true } // Return the updated staff record
    );

    if (!updatedStaff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    res.status(200).json({ message: 'Staff updated successfully', updatedStaff });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating staff', error: error.message });
  }
};

// Delete Staff by MongoDB unique _id
export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;  // MongoDB _id of the staff to be deleted

    // Check if _id is provided
    if (!id) {
      return res.status(400).json({ message: 'Staff _id is required' });
    }

    // Use MongoDB unique _id to find and delete the staff
    const deletedStaff = await Staff.findByIdAndDelete(id);

    if (!deletedStaff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    res.status(200).json({ message: 'Staff deleted successfully', deletedStaff });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting staff', error: error.message });
  }
};

// Admin Auth Controllers

 
// Create JWT Token
const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '2h' });
};

// Admin Signup Controller
export const adminSignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate Input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    // Check if Admin Already Exists
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Admin already exists with this email' });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create New Admin
    const admin = new Admin({ name, email, password: hashedPassword });
    await admin.save();

    // Generate JWT Token
    const token = createToken(admin._id);

    // Set HTTP-Only Cookie
    res.cookie('token', token, {
      httpOnly: true,
      // secure: 'develop', // Use secure cookies in production
      sameSite: 'strict',
      maxAge: 2 * 60 * 60 * 1000, // 2 hours
    });

    res.status(201).json({ message: 'Admin registered successfully', adminId: admin._id });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const {email,password} = req.body;
    const admin = await Admin.findOne({email});
    if(!admin) return res.status(400).json({message: 'Admin not found'})
      const isValidPassword = await bcrypt.compare(password, admin.password);
    if(!isValidPassword) return res.status(400).json({message: 'Invalid password'})
      const token = createToken(admin._id);
    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // Secure cookies in production
      sameSite: 'none', // Allows cross-origin cookies
      maxAge: 2 * 60 * 60 * 1000, // 2 hours
  });
  
      res.status(200).json({message: 'Admin logged in successfully', admin: admin})

  } catch (error) {
       res.status(500).json({message:"Error at login ", error: error.message });
  }
}

export const checkAuth = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ isAuthenticated: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ isAuthenticated: false, message: "Invalid token" });
    }

    res.status(200).json({ isAuthenticated: true, message: "Authenticated" });
  } catch (error) {
    res.status(401).json({ isAuthenticated: false, message: "Not authenticated" });
  }
};


export const adminLogout = (req, res) => {
  res.clearCookie("token", { path: "/", httpOnly: true, secure: true, sameSite: "None" });
  res.status(200).json({ message: "Logged out successfully" });
};
