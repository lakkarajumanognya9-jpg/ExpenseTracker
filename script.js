// ---------------- CATEGORY ----------------
const categories = {
  income: ["Salary", "Freelance", "Business"],
  expense: ["Food", "Rent", "Travel", "Shopping"],
  investment: ["Stocks", "Mutual Funds", "Crypto"],
  loan: ["EMI", "Loan Payment"],
  savings: ["Emergency Fund", "Retirement", "Education"]
};

// ---------------- CATEGORY UPDATE ----------------
function updateCategories() {
  const typeEl = document.getElementById("type");
  const categoryEl = document.getElementById("category");

  if (!typeEl || !categoryEl) return;

  categoryEl.innerHTML = "";

  const selectedType = typeEl.value.toLowerCase();

  if (!categories[selectedType]) return;

  categories[selectedType].forEach(category => {
    categoryEl.innerHTML += `
      <option value="${category}">${category}</option>
    `;
  });
}

// ---------------- DATE FORMAT ----------------
function formatDate(date) {
  if (!date) return "";

  // Handles:
  // 2026-08-18
  // 2026-08-18T00:00:00.000Z
  // 2026-08-18T00:00:00.000
  return String(date).split("T")[0];
}

// ---------------- ADD / EDIT TRANSACTION ----------------
async function addData(e) {
  e.preventDefault();

  const newItem = {
    title: document.getElementById("title").value.trim(),
    type: document.getElementById("type").value.trim().toLowerCase(),
    category: document.getElementById("category").value,
    amount: Number(document.getElementById("amount").value),
    date: document.getElementById("date").value
  };

  try {
    // Get current transactions
    const res = await fetch("http://127.0.0.1:7000/api/transactions");

    if (!res.ok) {
      throw new Error("Unable to fetch transactions");
    }

    const data = await res.json();

    let income = 0;
    let expense = 0;
    let investment = 0;
    let loan = 0;
    let savings = 0;

    data.forEach(item => {
      const amt = Number(item.amount) || 0;
      const type = (item.type || "").toLowerCase();

      if (type === "income") income += amt;
      if (type === "expense") expense += amt;
      if (type === "investment") investment += amt;
      if (type === "loan") loan += amt;
      if (type === "savings") savings += amt;
    });

    const balance =
      income - savings - loan - expense - investment;

    // Prevent spending more than available balance
    if (
      (
        newItem.type === "expense" ||
        newItem.type === "loan" ||
        newItem.type === "investment" ||
        newItem.type === "savings"
      ) &&
      newItem.amount > balance
    ) {
      alert("❌ You don’t have enough balance for this transaction");
      return;
    }

    const editId = localStorage.getItem("editId");

    if (editId) {
      // UPDATE
      const updateRes = await fetch(
        `http://127.0.0.1:7000/api/transactions/${editId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newItem)
        }
      );

      if (!updateRes.ok) {
        throw new Error("Unable to update transaction");
      }

      localStorage.removeItem("editId");

    } else {
      // ADD
      const addRes = await fetch(
        "http://127.0.0.1:7000/api/transactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newItem)
        }
      );

      if (!addRes.ok) {
        throw new Error("Unable to add transaction");
      }
    }

    window.location.href = "index.html";

  } catch (err) {
    console.error("ERROR:", err);
    alert("Something went wrong. Please check whether the server is running.");
  }
}

// ---------------- LOAD TABLE ----------------
async function loadTable() {
  try {
    const res = await fetch(
      "http://127.0.0.1:7000/api/transactions"
    );

    if (!res.ok) {
      throw new Error("Unable to load transactions");
    }

    const data = await res.json();

    const table = document.getElementById("tableBody");

    if (!table) return;

    let totalSpent = 0;

    table.innerHTML = "";

    data.forEach(item => {
      const type = (item.type || "").toLowerCase();
      const amount = Number(item.amount) || 0;

      if (
        type === "expense" ||
        type === "investment" ||
        type === "loan"
      ) {
        totalSpent += amount;
      }

      const displayDate = formatDate(item.date);

      table.innerHTML += `
        <tr>
          <td>${item.title || ""}</td>
          <td>${item.type || ""}</td>
          <td>${item.category || ""}</td>
          <td>₹${amount}</td>
          <td>${displayDate}</td>
          <td>
            <button onclick="editItem(${item.id})">
              Edit
            </button>

            <button onclick="deleteItem(${item.id})">
              Delete
            </button>
          </td>
        </tr>
      `;
    });

    const totalEl = document.getElementById("totalSpent");

    if (totalEl) {
      totalEl.innerText = totalSpent;
    }

  } catch (err) {
    console.error("Error loading table:", err);
  }
}

// ---------------- DELETE ----------------
async function deleteItem(id) {
  try {
    const res = await fetch(
      `http://127.0.0.1:7000/api/transactions/${id}`,
      {
        method: "DELETE"
      }
    );

    if (!res.ok) {
      throw new Error("Unable to delete transaction");
    }

    await loadTable();
    await loadDashboard();

  } catch (err) {
    console.error("Error deleting transaction:", err);
    alert("Unable to delete transaction.");
  }
}

// ---------------- EDIT ----------------
function editItem(id) {
  localStorage.setItem("editId", id);
  window.location.href = "add.html";
}

// ---------------- LOAD EDIT DATA ----------------
async function loadEditData() {
  const id = localStorage.getItem("editId");

  if (!id) return;

  try {
    const res = await fetch(
      "http://127.0.0.1:7000/api/transactions"
    );

    if (!res.ok) {
      throw new Error("Unable to load transaction");
    }

    const data = await res.json();

    const item = data.find(transaction => transaction.id == id);

    if (!item) return;

    const titleEl = document.getElementById("title");
    const typeEl = document.getElementById("type");
    const categoryEl = document.getElementById("category");
    const amountEl = document.getElementById("amount");
    const dateEl = document.getElementById("date");

    if (titleEl) {
      titleEl.value = item.title || "";
    }

    if (typeEl) {
      typeEl.value = (item.type || "").toLowerCase();
    }

    // Update categories based on selected type
    updateCategories();

    if (categoryEl) {
      categoryEl.value = item.category || "";
    }

    if (amountEl) {
      amountEl.value = item.amount || "";
    }

    // FIXED DATE
    if (dateEl) {
      dateEl.value = formatDate(item.date);
    }

  } catch (err) {
    console.error("Error loading edit data:", err);
  }
}

// ---------------- DASHBOARD ----------------
async function loadDashboard() {
  try {
    const res = await fetch(
      "http://127.0.0.1:7000/api/transactions"
    );

    if (!res.ok) {
      throw new Error("Unable to load dashboard data");
    }

    const data = await res.json();

    let income = 0;
    let expense = 0;
    let investment = 0;
    let loan = 0;
    let savings = 0;

    data.forEach(item => {
      const amount = Number(item.amount) || 0;
      const type = (item.type || "").toLowerCase();

      if (type === "income") income += amount;
      if (type === "expense") expense += amount;
      if (type === "investment") investment += amount;
      if (type === "loan") loan += amount;
      if (type === "savings") savings += amount;
    });

    const balance =
      income -
      savings -
      loan -
      expense -
      investment;

    const setValue = (id, value) => {
      const element = document.getElementById(id);

      if (element) {
        element.innerText = value;
      }
    };

    setValue("income", income);
    setValue("expense", expense);
    setValue("investment", investment);
    setValue("loan", loan);
    setValue("savings", savings);

    const balanceElement =
      document.getElementById("balance");

    if (balanceElement) {
      balanceElement.innerText = balance;

      balanceElement.style.color =
        balance < 0 ? "red" : "white";
    }

  } catch (err) {
    console.error("Error loading dashboard:", err);
  }
}

// ---------------- LOAD PAGE ----------------
document.addEventListener("DOMContentLoaded", () => {
  updateCategories();
  loadDashboard();
  loadTable();
  loadEditData();
});