const { db, admin } = require("../config/firebase");

/**
 * GET /api/dashboard/summary
 * Returns financial summary filtered by the authenticated user's uid.
 */
exports.getSummary = async (req, res) => {
  try {
    const uid = req.user.uid;

    const snapshot = await db
      .collection("transactions")
      .where("uid", "==", uid)
      .get();

    let totalIncome = 0;
    let totalExpense = 0;
    const items = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      const amount = Number(data.amount) || 0;
      const type = data.type || "expense";

      let timestamp = null;
      if (data.createdAt) {
        timestamp = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
      }

      if (type === "income") {
        totalIncome += amount;
      } else {
        totalExpense += amount;
      }

      items.push({ id: doc.id, ...data, createdAt: timestamp });
    });

    const netProfit = totalIncome - totalExpense;

    // Sort newest first
    items.sort((a, b) => {
      const dateA = a.createdAt || new Date(0);
      const dateB = b.createdAt || new Date(0);
      return dateB - dateA;
    });

    const recentTransactions = items.slice(0, 5);

    // Category breakdown
    const breakdown = { income: {}, expense: {} };
    items.forEach((item) => {
      const amount = Number(item.amount) || 0;
      const desc = (item.description || "other").toLowerCase();
      let category = "other";

      if (desc.includes("rent")) category = "rent";
      else if (desc.includes("salary") || desc.includes("wage")) category = "wages/salaries";
      else if (desc.includes("material") || desc.includes("stock") || desc.includes("goods"))
        category = "inventory/materials";
      else if (desc.includes("sale") || desc.includes("sold") || desc.includes("customer"))
        category = "sales";
      else if (desc.includes("food") || desc.includes("tea") || desc.includes("snack"))
        category = "meals/refreshments";
      else if (desc.includes("travel") || desc.includes("fuel") || desc.includes("fare"))
        category = "travel/transport";

      const target = item.type === "income" ? breakdown.income : breakdown.expense;
      target[category] = (target[category] || 0) + amount;
    });

    return res.status(200).json({
      success: true,
      data: { totalIncome, totalExpense, netProfit, recentTransactions, breakdown },
    });
  } catch (error) {
    console.error("Error in getSummary:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error.",
      message: error.message,
    });
  }
};

/**
 * GET /api/transactions
 * Moved to ledgerController.getTransactions
 * Kept here as alias for dashboard routes compatibility.
 */
exports.getTransactions = async (req, res) => {
  try {
    const { type } = req.query;
    const uid = req.user.uid;

    let query = db.collection("transactions").where("uid", "==", uid);
    if (type && (type === "income" || type === "expense")) {
      query = query.where("type", "==", type);
    }

    const snapshot = await query.get();
    if (snapshot.empty) return res.status(200).json({ success: true, data: [] });

    const transactions = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      let timestamp = null;
      if (data.createdAt) {
        timestamp = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
      }
      transactions.push({ id: doc.id, ...data, createdAt: timestamp });
    });

    transactions.sort((a, b) => {
      const dateA = a.createdAt || new Date(0);
      const dateB = b.createdAt || new Date(0);
      return dateB - dateA;
    });

    return res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    console.error("Error in getTransactions:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error.",
      message: error.message,
    });
  }
};
