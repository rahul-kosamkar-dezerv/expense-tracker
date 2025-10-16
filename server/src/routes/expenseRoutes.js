import express from 'express';
import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  getMonthlySummary
} from '../controllers/expenseController.js';

const router = express.Router();

router.get('/', getExpenses);
router.post('/', addExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);
router.get('/summary/:month', getMonthlySummary);

export default router;
