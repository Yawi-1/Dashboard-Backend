import Expense from "../models/expense.model.js";

export const addExpense = async (req, res) => {
  try {
    const { category, amount, paymentMethod, description, date } = req.body;

    if (!category || !amount || !paymentMethod || !description || !date) {
      return res
        .status(400)
        .json({ message: "Please fill in all fields", success: false });
    }
    const expense = await new Expense(req.body);
    const savedExpense = await expense.save();
    res.status(201).json({
      message: "Expense created successfully",
      success: true,
      expense: savedExpense,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const allExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.status(200).json({ expenses, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success:false });
  }
};

export const updateExpense = async (req,res)=>{
    try {
        const {id} = req.params;
        const {category, amount, paymentMethod, description, date} = req.body;
        const expense = await Expense.findByIdAndUpdate(id, req.body, {new: true});
        res.status(200).json({expense, success: true, message:"Expense updated successfully"});
    } catch (error) {
        res.status(500).json({message:error.message,success:false})
    }
}

export const deleteExpense = async (req, res) => {
    try{
        const {id} = req.params;
        const deletedExpense = await Expense.findByIdAndDelete(id);    
        if(!deletedExpense){
            return res.status(404).json({message:"Expense not found",success:false})
        }
        res.status(200).json({message:"Expense deleted successfully",success:true, expense : deletedExpense})
    }
    catch(error){
        res.status(500).json({message:error.message,success:false})
    }
}