import mongoose, { Schema } from "mongoose";

const expenseSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['Salary', 'Utilities', 'Rent', 'Office Supplies', 'Other'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Credit Card', 'Bank Transfer', 'UPI', 'Other'],
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
