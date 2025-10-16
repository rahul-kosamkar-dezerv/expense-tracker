import express from "express";
import cors from "cors";
import expenseRoutes from "./routes/expenseRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/expenses", expenseRoutes);

app.get("/", (req, res) => res.send("Expense Tracker API"));

export default app;
