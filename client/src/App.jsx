import React, { useEffect, useState } from "react";
import axios from "./api/axiosInstance";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    fetchExpenses();
    fetchSummary();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get("/");
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSummary = async () => {
    try {
      const month = new Date().toISOString().slice(0, 7);
      const res = await axios.get(`/summary/${month}`);
      setSummary(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addExpense = (e) => setExpenses((prev) => [e, ...prev]);
  const deleteExpense = (id) =>
    setExpenses((prev) => prev.filter((p) => p._id !== id));
  const onDelete = async (id) => {
    try {
      await axios.delete(`/${id}`);
      deleteExpense(id);
      fetchSummary();
    } catch (err) {
      console.error(err);
    }
  };

  const onAdd = (expense) => {
    addExpense(expense);
    fetchSummary();
  };

  return (
    <div className="container">
      <h1>Personal Expense Tracker</h1>
      <ExpenseForm onAdd={onAdd} />
      <ExpenseList expenses={expenses} onDelete={onDelete} />
      <h2>Monthly Summary</h2>
      <Dashboard summary={summary} />
    </div>
  );
}
