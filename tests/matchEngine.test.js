const { runMatchEngine, passesStrictFilters, calculateSoftScore } = require('../utils/matchEngine');

describe('Match Engine - passesStrictFilters', () => {
  it('should pass if all strict filters match', () => {
    const user = { state: 'maharashtra', gender: 'female', max_income: 100000, is_bpl: true };
    const scheme = { state: ['all'], gender: ['female', 'all'], max_income: 200000, is_bpl: false };
    expect(passesStrictFilters(user, scheme)).toBe(true);
  });

  it('should fail if state does not match', () => {
    const user = { state: 'maharashtra', gender: 'female', max_income: 100000 };
    const scheme = { state: ['gujarat'], gender: ['all'], max_income: 200000, is_bpl: false };
    expect(passesStrictFilters(user, scheme)).toBe(false);
  });

  it('should fail if income exceeds scheme max_income', () => {
    const user = { state: 'maharashtra', gender: 'female', annual_income: 300000 };
    const scheme = { state: ['all'], gender: ['all'], max_income: 200000, is_bpl: false };
    expect(passesStrictFilters(user, scheme)).toBe(false);
  });
});

describe('Match Engine - runMatchEngine', () => {
  it('should correctly score and rank schemes', () => {
    const user = {
      state: 'maharashtra',
      gender: 'female',
      max_income: 100000,
      is_bpl: false,
      age: 30,
      caste_category: 'general',
      employment_type: 'salaried',
      business_category: 'technology',
      education_level: 'graduate',
      marital_status: 'single',
      disability_status: false,
      residence_type: 'urban'
    };

    const schemes = [
      {
        scheme_id: 's1',
        eligibility_criteria: {
          state: ['all'], gender: ['all'], max_income: 500000, is_bpl: false,
          min_age: 18, max_age: 40, caste_category: ['general'], employment_type: ['salaried'],
          business_category: ['technology'], education_level: ['graduate'],
          marital_status: ['single'], disability_status: false, residence_type: ['urban']
        }
      },
      {
        scheme_id: 's2',
        eligibility_criteria: {
          state: ['gujarat'], gender: ['all'], max_income: 500000, is_bpl: false,
        }
      }
    ];

    const matchEngineResponse = runMatchEngine(user, schemes);
    const results = matchEngineResponse.results;
    expect(results.length).toBe(1); // s2 fails strict filters
    expect(results[0].scheme_id).toBe('s1');
    expect(results[0].match_score).toBeGreaterThan(0);
  });
});
