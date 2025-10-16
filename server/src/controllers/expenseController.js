import Expense from '../models/Expense.js';

export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const addExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;
    if (!title || amount === undefined || !category) {
      return res.status(400).json({ message: 'title, amount and category are required' });
    }
    const expense = new Expense({ title, amount, category, date });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Expense.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Expense not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await Expense.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMonthlySummary = async (req, res) => {
  try {
    const { month } = req.params; // expected YYYY-MM
    const start = new Date(f"{month}-01T00:00:00.000Z");
    const end = new Date(start);
    end.setMonth(start.getMonth() + 1);

    const summary = await Expense.aggregate([
      { $match: { date: { $gte: start, $lt: end } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } }
    ]);

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
