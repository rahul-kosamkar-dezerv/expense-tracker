import Expense from "../models/Expense.js";

export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const addExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;
    if (!title || amount === undefined || !category) {
      return res
        .status(400)
        .json({ message: "title, amount and category are required" });
    }
    const expense = new Expense({ title, amount, category, date });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Expense.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Expense not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await Expense.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ message: "Expense not found" });
    res.json({ message: "Expense deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMonthlySummary = async (req, res) => {
  try {
    const { month } = req.params; // expected format: YYYY-MM

    // Validate the month format
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({
        message: "Invalid or missing month (expected format: YYYY-MM)",
      });
    }

    // Create start and end dates for the month
    const start = new Date(`${month}-01T00:00:00.000Z`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    // Aggregate total and category-wise expenses
    const summary = await Expense.aggregate([
      {
        $match: {
          date: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalAmount: 1,
        },
      },
    ]);

    // Calculate overall total
    const totalSpent = summary.reduce((sum, item) => sum + item.totalAmount, 0);

    return res.status(200).json({
      month,
      totalSpent,
      breakdown: summary,
    });
  } catch (error) {
    console.error("Error fetching monthly summary:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
