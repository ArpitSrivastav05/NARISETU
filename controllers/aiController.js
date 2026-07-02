const { db } = require("../config/firebase");
const {
  serializeSnapshot,
  normalizeContext,
  calculateFinancialHealthScore,
  buildRecommendations,
  buildMonthlySummary,
  buildSavingsGoalProgress,
  generateCoachReply,
} = require("../utils/aiCoachService");

async function collectCoachContext(uid) {
  if (!db) {
    return {
      userProfile: null,
      businesses: [],
      products: [],
      transactions: [],
      savedSchemes: [],
      schemeMatches: [],
      monthlySavingsGoal: 0,
      projectedMonthlySavings: 0,
    };
  }

  const [userDoc, businessesSnapshot, productsSnapshot, transactionsSnapshot, savedSchemesSnapshot, schemeMatchesSnapshot] = await Promise.all([
    db.collection("users").doc(uid).get(),
    db.collection("businesses").where("uid", "==", uid).get(),
    db.collection("products").where("uid", "==", uid).get(),
    db.collection("transactions").where("uid", "==", uid).get(),
    db.collection("savedSchemes").where("userId", "==", uid).get(),
    db.collection("schemeMatches").where("userId", "==", uid).get(),
  ]);

  const userProfile = userDoc.exists ? { id: userDoc.id, ...userDoc.data() } : null;
  const businesses = serializeSnapshot(businessesSnapshot);
  const products = serializeSnapshot(productsSnapshot);
  const transactions = serializeSnapshot(transactionsSnapshot);
  const savedSchemes = serializeSnapshot(savedSchemesSnapshot);
  const schemeMatches = serializeSnapshot(schemeMatchesSnapshot);

  let totalIncome = 0;
  let totalExpense = 0;
  transactions.forEach((transaction) => {
    const amount = Number(transaction.amount) || 0;
    if (transaction.type === "income") totalIncome += amount;
    else totalExpense += amount;
  });

  const netProfit = totalIncome - totalExpense;
  const savingsGoal = userProfile?.aiCoach?.monthlySavingsGoal || userProfile?.monthlySavingsGoal || 0;
  const projectedMonthlySavings = Math.max(0, netProfit * 0.3);

  return {
    userProfile,
    businesses,
    products,
    transactions,
    savedSchemes,
    schemeMatches,
    totalIncome,
    totalExpense,
    netProfit,
    monthlySavingsGoal: savingsGoal,
    projectedMonthlySavings,
  };
}

async function generateSummaryPayload(uid) {
  const context = await collectCoachContext(uid);
  const normalized = normalizeContext(context);
  const financialHealth = calculateFinancialHealthScore(normalized);
  const recommendations = buildRecommendations(normalized);
  const summary = buildMonthlySummary(normalized);
  const savingsGoal = buildSavingsGoalProgress(normalized);

  return {
    context: normalized,
    financialHealth,
    recommendations,
    summary,
    savingsGoal,
  };
}

exports.chat = async (req, res) => {
  try {
    const { uid } = req.user;
    const { message } = req.body;

    if (!message || !String(message).trim()) {
      return res.status(400).json({ success: false, error: "Message is required." });
    }

    const context = await collectCoachContext(uid);
    const reply = await generateCoachReply(String(message).trim(), context);

    return res.status(200).json({
      success: true,
      data: {
        reply,
        financialHealth: calculateFinancialHealthScore(normalizeContext(context)),
      },
    });
  } catch (error) {
    console.error("Error in ai chat:", error);
    return res.status(500).json({ success: false, error: "Internal server error.", message: error.message });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const { uid } = req.user;
    const payload = await generateSummaryPayload(uid);

    return res.status(200).json({
      success: true,
      data: {
        summary: payload.summary,
        financialHealth: payload.financialHealth,
        recommendations: payload.recommendations,
        savingsGoal: payload.savingsGoal,
      },
    });
  } catch (error) {
    console.error("Error in ai summary:", error);
    return res.status(500).json({ success: false, error: "Internal server error.", message: error.message });
  }
};

exports.getFinancialHealth = async (req, res) => {
  try {
    const { uid } = req.user;
    const context = await collectCoachContext(uid);
    const financialHealth = calculateFinancialHealthScore(normalizeContext(context));

    return res.status(200).json({ success: true, data: financialHealth });
  } catch (error) {
    console.error("Error in ai financial health:", error);
    return res.status(500).json({ success: false, error: "Internal server error.", message: error.message });
  }
};

exports.setSavingsGoal = async (req, res) => {
  try {
    const { uid } = req.user;
    const { monthlySavingsGoal } = req.body;
    const parsedGoal = Number(monthlySavingsGoal);

    if (!Number.isFinite(parsedGoal) || parsedGoal < 0) {
      return res.status(400).json({ success: false, error: "monthlySavingsGoal must be a non-negative number." });
    }

    if (!db) {
      return res.status(503).json({ success: false, error: "Database not available." });
    }

    await db.collection("users").doc(uid).set(
      {
        aiCoach: {
          monthlySavingsGoal: parsedGoal,
          updatedAt: new Date().toISOString(),
        },
      },
      { merge: true }
    );

    const payload = await generateSummaryPayload(uid);

    return res.status(200).json({
      success: true,
      data: {
        monthlySavingsGoal: parsedGoal,
        savingsGoal: payload.savingsGoal,
        financialHealth: payload.financialHealth,
      },
    });
  } catch (error) {
    console.error("Error in ai set savings goal:", error);
    return res.status(500).json({ success: false, error: "Internal server error.", message: error.message });
  }
};
