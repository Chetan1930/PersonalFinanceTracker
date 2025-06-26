import { useEffect, useState } from "react";

function App() {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [amt, setAmt] = useState("");
  const [transText, setTransText] = useState("");
  const [bal, setBal] = useState(0);
  const [his, setHis] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem("historyTillNow");
    if (data) {
      const parsed = JSON.parse(data);
      setHis(parsed);

      let totalIncome = 0;
      let totalExpense = 0;
      parsed.forEach((t) => {
        if (t.balance > 0) totalIncome += t.balance;
        else totalExpense -= Math.abs(t.balance);
      });

      setIncome(totalIncome);
      setExpense(totalExpense);
      setBal(totalIncome - totalExpense);
    }
  }, []);

  useEffect(() => {
    setBal(income - expense);
    localStorage.setItem("historyTillNow", JSON.stringify(his));
  }, [his, income, expense]);

  function addTrans(e) {
    e.preventDefault();
    const amount = parseFloat(amt);
    if (isNaN(amount) || amount === 0) return;

    if (amount < 0) {
      setExpense((prev) => prev + Math.abs(amount));
    } else {
      setIncome((prev) => prev + Math.abs(amount));
    }

    const newTrans = {
      id: Date.now(),
      text: transText,
      balance: amount,
    };
    setHis([...his, newTrans]);

    setTransText("");
    setAmt("");
  }

  function delhis(id) {
    const updated = his.filter((t) => t.id !== id);
    setHis(updated);

    const deleted = his.find((t) => t.id === id);
    if (deleted) {
      if (deleted.balance > 0) setIncome((prev) => prev - deleted.balance);
      else setExpense((prev) => prev - Math.abs(deleted.balance));
    }
  }

  function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits:2,
  }).format(amount);
}


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8 font-sans">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-purple-700">
          Expense Tracker
        </h1>

        <div className="text-xl font-medium text-center mb-4">
          Your Balance: <span className="font-bold text-blue-600">{formatCurrency(bal)}</span>

        </div>

        <div className="flex justify-between mb-6 bg-gray-50 p-4 rounded-md shadow-sm">
          <div className="text-green-600 font-semibold">
            Income:{ formatCurrency(income)}
          </div>
          <div className="text-red-600 font-semibold">
            Expense:{formatCurrency(expense)}
          </div>
        </div>

        <form onSubmit={addTrans} className="space-y-4">
          <div>
            <label className="block font-medium">Note for Transaction</label>
            <input
              type="text"
              value={transText}
              placeholder="e.g., Salary or Rent"
              onChange={(e) => setTransText(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            />
          </div>
          <div>
            <label className="block font-medium">
              Amount (Negative = Expense, Positive = Income)
            </label>
            <input
              type="number"
              value={amt}
              onChange={(e) => setAmt(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
          >
            Add Transaction
          </button>
        </form>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">History</h2>
          <ul className="space-y-2">
            {his.map((t) => (
              <li
                key={t.id}
                className={`flex justify-between items-center px-4 py-2 rounded border-l-4 shadow ${
                  t.balance > 0
                    ? "bg-green-50 border-green-500"
                    : "bg-red-50 border-red-500"
                }`}
              >
                <div>
                  <p className="font-medium">{t.text}</p>
                  <span className="text-sm text-gray-600">
                    {formatCurrency(t.balance)}
                  </span>
                </div>
                <button
                  onClick={() => delhis(t.id)}
                  className="text-red-500 font-bold hover:text-red-700"
                >
                  ✖
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
