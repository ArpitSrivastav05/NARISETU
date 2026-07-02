const test = require('node:test');
const assert = require('node:assert/strict');

const {
  calculateFinancialHealthScore,
  buildRecommendations,
} = require('../utils/aiCoachService');

test('calculateFinancialHealthScore rewards profitable businesses and clear savings goals', () => {
  const result = calculateFinancialHealthScore({
    totalIncome: 25000,
    totalExpense: 12000,
    netProfit: 13000,
    products: [{ id: 'p1' }],
    businesses: [{ id: 'b1' }],
    savedSchemes: [{ id: 's1' }],
    schemeMatches: [{ id: 'm1' }],
    monthlySavingsGoal: 4000,
    projectedMonthlySavings: 3000,
  });

  assert.equal(result.score >= 70, true);
  assert.equal(result.status, 'strong');
  assert.equal(result.breakdown.profitability > 0, true);
  assert.equal(result.breakdown.savingsProgress > 0, true);
});

test('buildRecommendations flags burnout risk when expenses outpace income', () => {
  const recommendations = buildRecommendations({
    totalIncome: 8000,
    totalExpense: 12000,
    netProfit: -4000,
    products: [],
    businesses: [{ id: 'b1' }],
    savedSchemes: [],
    schemeMatches: [],
    monthlySavingsGoal: 2000,
    projectedMonthlySavings: 0,
  });

  assert.equal(recommendations.length >= 2, true);
  assert.equal(recommendations.some((item) => item.type === 'cash-flow'), true);
});
