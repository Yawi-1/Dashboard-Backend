import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  staffId: { type: String, unique: true, required: true },
  role: { type: String, required: true },
  password: { type: String, required: true },
});

const Staff = mongoose.model('Staff', staffSchema);
export default Staff;
