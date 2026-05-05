import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";
import "./App.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

function App() {
  // 🔐 LOGIN STATE
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("token") ? true : false
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // 💰 DASHBOARD STATES
  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [budget, setBudget] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [lineGraph, setLineGraph] = useState(null);

  // ================= LOGIN =================
  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true);
      } else {
        alert(data.message || "Login failed");
      }
    } catch {
      alert("Server error");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window,location.href = "/";
    
  };

  // ================= DATA =================
  const fetchExpenses = async () => {
    const res = await fetch(`http://localhost:5000/api/expenses/${month}`);
    const data = await res.json();
    setExpenses(Array.isArray(data) ? data : []);
  };

  const fetchGraph = async () => {
    const res = await fetch("http://localhost:5000/api/expenses");
    const data = await res.json();

    const months = [...new Set(data.map(e => e.month))].sort();
    const categories = [...new Set(data.map(e => e.category))];

    const datasets = categories.map((cat, index) => ({
      label: cat,
      data: months.map(m =>
        data
          .filter(e => e.month === m && e.category === cat)
          .reduce((sum, e) => sum + e.amount, 0)
      ),
      borderColor: ["#6366f1", "#22c55e", "#f97316", "#ef4444"][index % 4],
      tension: 0.4
    }));

    setLineGraph({ labels: months, datasets });
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchExpenses();
      fetchGraph();
    }
  }, [month, isLoggedIn]);

  // ================= ACTIONS =================
  const addExpense = async () => {
    if (!amount || !category) return alert("Enter details");

    await fetch("http://localhost:5000/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Number(amount),
        category,
        month
      })
    });

    setAmount("");
    setCategory("");
    fetchExpenses();
    fetchGraph();
  };

  const resetMonth = async () => {
    await fetch(`http://localhost:5000/api/expenses/${month}`, {
      method: "DELETE"
    });

    setBudget("");
    fetchExpenses();
    fetchGraph();
  };

  // ================= CALCULATIONS =================
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = budget ? budget - total : 0;

  const pieData = {
    labels: expenses.map(e => e.category),
    datasets: [
      {
        data: expenses.map(e => e.amount),
        backgroundColor: ["#6366f1", "#22c55e", "#f97316", "#ef4444"]
      }
    ]
  };

  const getInsights = () => {
    if (!lineGraph) return "Add data to see insights";

    return lineGraph.datasets
      .map(ds => {
        if (ds.data.length < 2) return "";
        const last = ds.data.at(-1);
        const prev = ds.data.at(-2);

        if (last > prev) return `${ds.label} increased 📈`;
        if (last < prev) return `${ds.label} decreased 📉`;
        return `${ds.label} stable ➖`;
      })
      .join(" | ");
  };

  // ================= LOGIN UI =================

  // ================= DASHBOARD UI =================
  return (
    <div className="dashboard-container">

      <div className="dashboard-header">
        <h1>💰 Smart Budget Dashboard</h1>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="card">

        {/* MONTH + BUDGET */}
        <div className="row">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />

          <input
            type="number"
            placeholder="Budget"
            onChange={(e) => setBudget(Number(e.target.value))}
          />
        </div>

        {/* STATS */}
        <div className="stats">
          <div className="stat-box">
            <h4>Budget</h4>
            <p>₹{budget || 0}</p>
          </div>

          <div className="stat-box">
            <h4>Spent</h4>
            <p>₹{total}</p>
          </div>

          <div className="stat-box green">
            <h4>Remaining</h4>
            <p>₹{remaining}</p>
          </div>
        </div>

        {/* ADD EXPENSE */}
        <div className="row">
          <input
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <button className="add-btn" onClick={addExpense}>
            Add
          </button>

          <button onClick={resetMonth}>Reset</button>
        </div>

        {/* EXPENSE LIST */}
        <h3>Expenses</h3>
        {expenses.map((e, i) => (
          <p key={i}>₹{e.amount} - {e.category}</p>
        ))}

        {/* PIE CHART */}
        {expenses.length > 0 && (
          <div className="chart-small">
            <Pie data={pieData} />
          </div>
        )}

        {/* LINE GRAPH */}
        <h3>📈 Category Trends</h3>
        <div className="chart-large">
          {lineGraph && <Line data={lineGraph} />}
        </div>

        {/* AI INSIGHTS */}
        <h3>🧠 AI Insights</h3>
        <p className="insights">{getInsights()}</p>

      </div>
    </div>
  );
}

export default App;