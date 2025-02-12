import { Router } from "express";
import { addExpense,allExpenses,updateExpense,deleteExpense } from "../controller/expense.controller.js";
const router = Router();

router.post("/Create", addExpense);
router.get('/getAllExpenses',allExpenses)
router.delete('/delete/:id',deleteExpense);
router.put('/update/:id',updateExpense)

export default router;
