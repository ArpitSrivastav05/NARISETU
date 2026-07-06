const { GoogleGenAI } = require("@google/genai");

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toDate(value) {
  if (!value) return null;
  if (value.toDate) return value.toDate();
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function serializeDocument(doc) {
  if (!doc) return null;
  const data = doc.data ? doc.data() : doc;
  if (!data) return null;

  const record = { ...data };
  if (record.createdAt) record.createdAt = toDate(record.createdAt)?.toISOString() || null;
  if (record.updatedAt) record.updatedAt = toDate(record.updatedAt)?.toISOString() || null;
  if (record.timestamp) record.timestamp = toDate(record.timestamp)?.toISOString() || null;
  return record;
}

function serializeSnapshot(snapshot) {
  const items = [];
  snapshot.forEach((doc) => {
    const data = serializeDocument(doc);
    if (data) {
      items.push({ id: doc.id, ...data });
    }
  });
  return items;
}

function normalizeContext(payload = {}) {
  const totalIncome = toNumber(payload.totalIncome, 0);
  const totalExpense = toNumber(payload.totalExpense, 0);
  const netProfit = totalIncome - totalExpense;
  const products = Array.isArray(payload.products) ? payload.products : [];
  const businesses = Array.isArray(payload.businesses) ? payload.businesses : [];
  const savedSchemes = Array.isArray(payload.savedSchemes) ? payload.savedSchemes : [];
  const schemeMatches = Array.isArray(payload.schemeMatches) ? payload.schemeMatches : [];
  const learningProgress = payload.learningProgress || {};
  const monthlySavingsGoal = toNumber(payload.monthlySavingsGoal, 0);
  const projectedMonthlySavings = Math.max(0, toNumber(payload.projectedMonthlySavings, Math.max(0, netProfit * 0.3)));

  return {
    ...payload,
    totalIncome,
    totalExpense,
    netProfit,
    products,
    businesses,
    savedSchemes,
    schemeMatches,
    learningProgress,
    monthlySavingsGoal,
    projectedMonthlySavings,
  };
}

function calculateFinancialHealthScore(context = {}) {
  const normalized = normalizeContext(context);
  const { totalIncome, totalExpense, netProfit, products, businesses, savedSchemes, schemeMatches, monthlySavingsGoal, projectedMonthlySavings } = normalized;

  const profitabilityRatio = totalIncome > 0 ? Math.min(100, Math.max(0, (netProfit / totalIncome) * 100)) : 0;
  const expenseControlRatio = totalIncome > 0 ? Math.min(100, Math.max(0, ((totalIncome - totalExpense) / totalIncome) * 100)) : 0;
  const activityScore = Math.min(20, (products.length + businesses.length + savedSchemes.length + schemeMatches.length) * 4);
  const savingsProgress = monthlySavingsGoal > 0 ? Math.min(100, Math.max(0, (projectedMonthlySavings / monthlySavingsGoal) * 100)) : 0;

  const score = Math.round(
    Math.max(0, Math.min(100, 35 + profitabilityRatio * 0.35 + expenseControlRatio * 0.25 + activityScore * 0.15 + savingsProgress * 0.25))
  );

  let status = "needs-attention";
  if (score >= 80) status = "strong";
  else if (score >= 60) status = "steady";
  else if (score >= 40) status = "building";

  return {
    score,
    status,
    breakdown: {
      profitability: Math.round(profitabilityRatio),
      expenseControl: Math.round(expenseControlRatio),
      activity: activityScore,
      savingsProgress: Math.round(savingsProgress),
    },
  };
}

function buildRecommendations(context = {}) {
  const normalized = normalizeContext(context);
  const { netProfit, businesses, products, savedSchemes, monthlySavingsGoal, projectedMonthlySavings } = normalized;
  const recommendations = [];

  if (netProfit < 0) {
    recommendations.push({
      type: "cash-flow",
      title: "Protect your cash flow",
      description: "Your current outflows are higher than inflows. Consider trimming discretionary spending and reviewing recurring costs this month.",
    });
  } else if (netProfit > 0) {
    recommendations.push({
      type: "growth",
      title: "Reinvest surplus carefully",
      description: "You are generating a positive margin. Set aside a portion for inventory, marketing, or emergency reserves.",
    });
  }

  if (!businesses.length) {
    recommendations.push({
      type: "profile",
      title: "Complete your business profile",
      description: "Adding a business profile helps the platform tailor guidance and suggest relevant schemes.",
    });
  }

  if (!products.length) {
    recommendations.push({
      type: "products",
      title: "List a product or service",
      description: "A product snapshot gives the coach clearer context and helps you spot demand patterns.",
    });
  }

  if (!savedSchemes.length) {
    recommendations.push({
      type: "schemes",
      title: "Save an opportunity",
      description: "Bookmarking schemes lets the coach connect your financial profile to public support you may be eligible for.",
    });
  }

  if (monthlySavingsGoal > 0 && projectedMonthlySavings < monthlySavingsGoal) {
    recommendations.push({
      type: "savings",
      title: "Bridge your savings gap",
      description: `Your current surplus is tracking below your goal. Aim to save about ₹${Math.max(0, monthlySavingsGoal - projectedMonthlySavings).toLocaleString("en-IN")} more this month.`,
    });
  }

  return recommendations.slice(0, 3);
}

function buildMonthlySummary(context = {}) {
  const normalized = normalizeContext(context);
  const { totalIncome, totalExpense, netProfit, businesses, products, savedSchemes, schemeMatches, monthlySavingsGoal, projectedMonthlySavings } = normalized;

  const goalText = monthlySavingsGoal > 0
    ? `You have a monthly savings target of ₹${monthlySavingsGoal.toLocaleString("en-IN")}.`
    : "Set a monthly savings target to start tracking your growth more intentionally.";

  const focusText = netProfit >= 0
    ? `Your current operating margin is ₹${Math.abs(netProfit).toLocaleString("en-IN")}.`
    : `Your business is currently running a shortfall of ₹${Math.abs(netProfit).toLocaleString("en-IN")}.`;

  return [
    `You have ${products.length} product${products.length === 1 ? "" : "s"}, ${businesses.length} business profile${businesses.length === 1 ? "" : "s"}, and ${savedSchemes.length} saved scheme${savedSchemes.length === 1 ? "" : "s"} in your workspace.`,
    `This month, your income stands at ₹${totalIncome.toLocaleString("en-IN")} against expenses of ₹${totalExpense.toLocaleString("en-IN")}.`,
    focusText,
    goalText,
    `Your coaching model currently projects monthly savings of ₹${projectedMonthlySavings.toLocaleString("en-IN")} based on your recent activity and ${schemeMatches.length} recent scheme match${schemeMatches.length === 1 ? "" : "es"}.`,
  ].join(" ");
}

function buildSavingsGoalProgress(context = {}) {
  const normalized = normalizeContext(context);
  const { monthlySavingsGoal, projectedMonthlySavings } = normalized;
  const progressPercent = monthlySavingsGoal > 0 ? Math.min(100, Math.round((projectedMonthlySavings / monthlySavingsGoal) * 100)) : 0;
  const remaining = Math.max(0, monthlySavingsGoal - projectedMonthlySavings);
  return {
    monthlySavingsGoal,
    projectedMonthlySavings,
    progressPercent,
    remaining,
    status: progressPercent >= 100 ? "goal-met" : progressPercent >= 70 ? "on-track" : "needs-attention",
  };
}

async function generateGeminiReply(prompt, formatJson = false) {
  if (!process.env.GEMINI_API_KEY) return null;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: formatJson ? { responseMimeType: "application/json" } : undefined
    });
    return response?.text || null;
  } catch (error) {
    console.warn("Gemini request failed, falling back to local guidance:", error.message);
    return null;
  }
}

async function generateCoachReply(message, context = {}) {
  const normalized = normalizeContext(context);
  const financialHealth = calculateFinancialHealthScore(normalized);
  const prompt = [
    "You are NariSetu AI Business Coach.",
    "Use the user's financial truth to give a concise personalized response.",
    `User message: ${message}`,
    `Financial health score: ${financialHealth.score}/100`,
    `Monthly summary: ${buildMonthlySummary(normalized)}`,
    "Reply in 2 short paragraphs max and include one practical next step.",
  ].join("\n");

  const geminiReply = await generateGeminiReply(prompt);
  if (geminiReply) return geminiReply.trim();

  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes("goal") || lowerMessage.includes("save")) {
    return `Your current projection suggests you can set aside about ₹${normalized.projectedMonthlySavings.toLocaleString("en-IN")} this month. A practical next step is to create a small weekly transfer to a separate savings bucket.`;
  }

  if (lowerMessage.includes("scheme") || lowerMessage.includes("support")) {
    return `The strongest opportunity is to review the schemes you have saved and compare them to your current business profile. I recommend checking the ones that match your recent activity and location.`;
  }

  return `Your current position looks ${financialHealth.status}. Focus on one improvement this week: trim one recurring expense, capture one more transaction, or save a little more toward your target.`;
}

async function generateIntelligenceFeed(context = {}) {
  const normalized = normalizeContext(context);
  const financialHealth = calculateFinancialHealthScore(normalized);
  
  const prompt = `You are the NariSetu Intelligence Engine.
Analyze this user's data and provide a highly personalized daily briefing, business roadmap, predictive analytics, and smart notifications.

CONTEXT:
- Financial Health Score: ${financialHealth.score}/100 (${financialHealth.status})
- Monthly Income: ₹${normalized.totalIncome}
- Monthly Expenses: ₹${normalized.totalExpense}
- Net Profit: ₹${normalized.netProfit}
- Products: ${normalized.products.length}
- Businesses: ${normalized.businesses.length}
- Enrolled Courses: ${Object.keys(normalized.learningProgress).length}

REQUIREMENTS:
1. Daily Briefing: A short, welcoming greeting (1-2 sentences) summarizing their current standing.
2. Roadmap: Exactly 3 actionable next steps to improve their business. Each should have a title and short description.
3. Predictive: Predict their revenue and expenses for the next 7 days based on their monthly run rate. Include a short 'trend' insight.
4. Notifications: 2 contextual alerts (e.g. "Your expenses are high", or "You should list a new product").

Return EXACTLY in this JSON format:
{
  "briefing": "string",
  "roadmap": [
    { "title": "string", "description": "string" }
  ],
  "predictive": {
    "predictedRevenue": number,
    "predictedExpense": number,
    "trendInsight": "string"
  },
  "notifications": [
    { "type": "warning|success|info", "message": "string" }
  ]
}`;

  const jsonReply = await generateGeminiReply(prompt, true);
  
  try {
    if (jsonReply) {
      // Clean up markdown block if present
      const cleaned = jsonReply.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(cleaned);
    }
  } catch (err) {
    console.warn("Failed to parse AI Intelligence JSON:", err.message);
  }

  // Fallback
  return {
    briefing: "Welcome to your Intelligence Dashboard. We're analyzing your data to help you grow.",
    roadmap: [
      { title: "Review Expenses", description: "Look for subscriptions or costs you can cut." },
      { title: "Update Products", description: "Ensure your inventory is up to date." },
      { title: "Continue Learning", description: "Finish a module in the Learning Hub." }
    ],
    predictive: {
      predictedRevenue: Math.round(normalized.totalIncome / 4),
      predictedExpense: Math.round(normalized.totalExpense / 4),
      trendInsight: "Maintaining a steady course based on recent activity."
    },
    notifications: [
      { type: "info", message: "Connect more transactions for better AI insights." }
    ]
  };
}

async function optimizeProductDescription(productData) {
  const prompt = `You are an expert AI Marketing Assistant.
Rewrite this product description to be engaging, professional, and SEO-optimized for a marketplace.

Product Name: ${productData.name}
Current Price: ₹${productData.price}
Current Description: ${productData.description || "N/A"}

Return EXACTLY in this JSON format:
{
  "optimizedDescription": "string",
  "marketingTips": ["string", "string"]
}`;

  const jsonReply = await generateGeminiReply(prompt, true);
  try {
    if (jsonReply) {
      const cleaned = jsonReply.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(cleaned);
    }
  } catch (err) {
    console.warn("Failed to parse optimize JSON:", err.message);
  }
  
  return {
    optimizedDescription: productData.description + " (Quality guaranteed!)",
    marketingTips: ["Add more high-quality photos.", "Highlight unique features."]
  };
}

module.exports = {
  serializeDocument,
  serializeSnapshot,
  normalizeContext,
  calculateFinancialHealthScore,
  buildRecommendations,
  buildMonthlySummary,
  buildSavingsGoalProgress,
  generateCoachReply,
  generateIntelligenceFeed,
  optimizeProductDescription,
};
