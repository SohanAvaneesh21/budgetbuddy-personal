import { apiClient } from "@/app/api-client";

export interface FinancialHealthResponse {
  overallScore: number;
  breakdown: {
    budgetAdherence: number;
    savingsRate: number;
    debtToIncome: number;
    emergencyFund: number;
    spendingConsistency: number;
  };
  riskAlerts: Array<{
    type: "high" | "medium" | "low";
    title: string;
    description: string;
    action: string;
  }>;
  wellnessTips: Array<{
    category: string;
    tip: string;
    impact: "high" | "medium" | "low";
  }>;
}

export interface BudgetOptimizationResponse {
  optimizedBudget: Record<string, {
    current: number;
    suggested: number;
    reasoning: string;
  }>;
  emergencyFund: {
    currentMonths: number;
    targetMonths: number;
    monthlyContribution: number;
    timeToTarget: number;
  };
  seasonalAdjustments: Array<{
    month: string;
    category: string;
    adjustment: number;
    reason: string;
  }>;
  savingsPotential: {
    monthly: number;
    annual: number;
    strategies: string[];
  };
}

export interface SpendingInsightsResponse {
  predictions: {
    nextMonth: {
      totalSpending: number;
      confidence: number;
      categoryBreakdown: Record<string, {
        predicted: number;
        confidence: number;
      }>;
    };
  };
  trends: Array<{
    category: string;
    trend: "increasing" | "decreasing" | "stable";
    changePercentage: number;
    insight: string;
    impact: "high" | "medium" | "low";
  }>;
  anomalies: Array<{
    date: string;
    category: string;
    amount: number;
    expectedAmount: number;
    severity: "high" | "medium" | "low";
    description: string;
  }>;
  categoryInsights: Array<{
    category: string;
    currentSpend: number;
    avgSpend: number;
    trend: "up" | "down" | "stable";
    explanation: string;
    recommendation: string;
  }>;
}

export interface SavingsStrategiesResponse {
  savingsOpportunities: Array<{
    category: string;
    currentSpend: number;
    potentialSavings: number;
    difficulty: "easy" | "medium" | "hard";
    timeframe: string;
    description: string;
    action: string;
  }>;
  investmentReadiness: {
    score: number;
    factors: {
      emergencyFund: boolean;
      debtRatio: boolean;
      stableIncome: boolean;
      riskTolerance: boolean;
    };
    recommendation: string;
    suggestedAllocation: {
      emergency: number;
      debt: number;
      investment: number;
    };
  };
  debtOptimization: Array<{
    debtName: string;
    currentBalance: number;
    interestRate: number;
    suggestedStrategy: "avalanche" | "snowball";
    monthlyPayment: number;
    payoffTime: number;
    interestSaved: number;
  }>;
  goalBasedRecommendations: Array<{
    goalName: string;
    targetAmount: number;
    timeframe: string;
    monthlyRequired: number;
    strategy: string;
    riskLevel: "low" | "medium" | "high";
  }>;
}

export interface LoanOptimizationResponse {
  optimization: {
    totalDebtReduction: number;
    monthlySavings: number;
    payoffAcceleration: number;
  };
  strategies: Array<{
    strategy: string;
    description: string;
    impact: "high" | "medium" | "low";
    implementation: string;
  }>;
  consolidationOpportunity: {
    eligible: boolean;
    newRate: number;
    monthlySavings: number;
    totalSavings: number;
  };
  payoffPlan: Array<{
    loanId: string;
    priority: number;
    reason: string;
    suggestedPayment: number;
    payoffTime: number;
  }>;
}

export interface GoalRecommendationsResponse {
  goalOptimization: Array<{
    goalId: string;
    currentProgress: number;
    recommendedMonthly: number;
    timeToGoal: number;
    feasibility: "high" | "medium" | "low";
    adjustments: string;
  }>;
  priorityRanking: Array<{
    goalId: string;
    priority: number;
    reasoning: string;
  }>;
  houseBuyingAdvice: {
    readiness: "ready" | "almost" | "not_ready";
    downPaymentTarget: number;
    monthlyBudget: number;
    timeframe: string;
    preparation: string[];
  };
  sipRecommendations: {
    monthlyAmount: number;
    allocation: {
      equity: number;
      debt: number;
      international: number;
    };
    expectedReturns: number;
    riskProfile: "conservative" | "moderate" | "aggressive";
  };
}

// AI Recommendations API using RTK Query
export const aiRecommendationsApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getFinancialHealthScore: builder.query<FinancialHealthResponse, void>({
      query: () => "/ai-recommendations/financial-health",
    }),
    getBudgetOptimization: builder.query<BudgetOptimizationResponse, void>({
      query: () => "/ai-recommendations/budget-optimization",
    }),
    getSpendingInsights: builder.query<SpendingInsightsResponse, void>({
      query: () => "/ai-recommendations/spending-insights",
    }),
    getSavingsStrategies: builder.query<SavingsStrategiesResponse, void>({
      query: () => "/ai-recommendations/savings-strategies",
    }),
    getLoanOptimization: builder.query<LoanOptimizationResponse, void>({
      query: () => "/ai-recommendations/loan-optimization",
    }),
    getGoalRecommendations: builder.query<GoalRecommendationsResponse, void>({
      query: () => "/ai-recommendations/goal-recommendations",
    }),
  }),
});

export const {
  useGetFinancialHealthScoreQuery,
  useGetBudgetOptimizationQuery,
  useGetSpendingInsightsQuery,
  useGetSavingsStrategiesQuery,
  useGetLoanOptimizationQuery,
  useGetGoalRecommendationsQuery,
} = aiRecommendationsApi;
