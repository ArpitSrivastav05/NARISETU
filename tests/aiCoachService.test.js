const {
  calculateFinancialHealthScore,
  buildRecommendations,
} = require('../utils/aiCoachService');

describe('aiCoachService', () => {
  it('calculateFinancialHealthScore rewards profitable businesses and clear savings goals', () => {
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

    expect(result.score).toBeGreaterThanOrEqual(70);
    expect(result.status).toBe('strong');
    expect(result.breakdown.profitability).toBeGreaterThan(0);
    expect(result.breakdown.savingsProgress).toBeGreaterThan(0);
  });

  it('buildRecommendations flags burnout risk when expenses outpace income', () => {
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

    expect(recommendations.length).toBeGreaterThanOrEqual(2);
    expect(recommendations.some((item) => item.type === 'cash-flow')).toBe(true);
  });
});
