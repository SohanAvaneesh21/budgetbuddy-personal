import { genAI, genAIModel } from "../config/google-ai.config";
import { createUserContent } from "@google/genai";

interface FinancialHealthData {
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
  debtToIncomeRatio: number;
  emergencyFundMonths: number;
  categories: Record<string, { amount: number; percentage: number }>;
}

interface BudgetOptimizationData {
  monthlyIncome: number;
  currentBudget: Record<string, number>;
  financialGoals: Array<{
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string;
  }>;
}

interface SpendingInsightData {
  monthlyTransactions: Array<{
    date: string;
    amount: number;
    category: string;
    description: string;
  }>;
  historicalData: Record<string, number>;
}

export const generateFinancialHealthScore = async (data: FinancialHealthData) => {
  try {
    const prompt = `
You are an AI financial advisor. Analyze the following financial data and provide a comprehensive health assessment.

Financial Data:
- Monthly Income: $${data.totalIncome}
- Monthly Expenses: $${data.totalExpenses}
- Savings Rate: ${data.savingsRate}%
- Debt-to-Income Ratio: ${data.debtToIncomeRatio}%
- Emergency Fund: ${data.emergencyFundMonths} months
- Spending Categories: ${JSON.stringify(data.categories)}

Provide a JSON response with:
{
  "overallScore": number (0-100),
  "breakdown": {
    "budgetAdherence": number (0-100),
    "savingsRate": number (0-100),
    "debtToIncome": number (0-100),
    "emergencyFund": number (0-100),
    "spendingConsistency": number (0-100)
  },
  "riskAlerts": [
    {
      "type": "high|medium|low",
      "title": "string",
      "description": "string",
      "action": "string"
    }
  ],
  "wellnessTips": [
    {
      "category": "string",
      "tip": "string",
      "impact": "high|medium|low"
    }
  ]
}

Rules:
1. Score based on financial best practices
2. Emergency fund should be 3-6 months for good score
3. Debt-to-income should be below 30% for good score
4. Savings rate should be 20%+ for excellent score
5. Provide actionable, specific recommendations
`;

    const result = await genAI.models.generateContent({
      model: genAIModel,
      contents: [createUserContent([prompt])],
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });

    const response = result.text;
    const cleanedText = response?.replace(/```(?:json)?\n?/g, "").trim();
    
    if (!cleanedText) return null;
    
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating financial health score:", error);
    return null;
  }
};

export const generateBudgetOptimization = async (data: BudgetOptimizationData) => {
  try {
    const prompt = `
You are an AI budget optimization expert. Analyze the financial data and provide smart budget recommendations.

Data:
- Monthly Income: $${data.monthlyIncome}
- Current Budget: ${JSON.stringify(data.currentBudget)}
- Financial Goals: ${JSON.stringify(data.financialGoals)}

Provide a JSON response with:
{
  "optimizedBudget": {
    "category": {
      "current": number,
      "suggested": number,
      "reasoning": "string"
    }
  },
  "emergencyFund": {
    "currentMonths": number,
    "targetMonths": number,
    "monthlyContribution": number,
    "timeToTarget": number
  },
  "seasonalAdjustments": [
    {
      "month": "string",
      "category": "string",
      "adjustment": number,
      "reason": "string"
    }
  ],
  "savingsPotential": {
    "monthly": number,
    "annual": number,
    "strategies": ["string"]
  }
}

Rules:
1. Follow 50/30/20 rule as baseline (needs/wants/savings)
2. Prioritize emergency fund before other goals
3. Consider seasonal spending patterns
4. Provide specific, actionable recommendations
5. Account for debt payments in budget allocation
`;

    const result = await genAI.models.generateContent({
      model: genAIModel,
      contents: [createUserContent([prompt])],
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });

    const response = result.text;
    const cleanedText = response?.replace(/```(?:json)?\n?/g, "").trim();
    
    if (!cleanedText) return null;
    
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating budget optimization:", error);
    return null;
  }
};

export const generateSpendingInsights = async (data: SpendingInsightData) => {
  try {
    const prompt = `
You are an AI spending analyst. Analyze transaction patterns and provide predictive insights.

Data:
- Recent Transactions: ${JSON.stringify(data.monthlyTransactions.slice(0, 50))}
- Historical Monthly Spending: ${JSON.stringify(data.historicalData)}

Provide a JSON response with:
{
  "predictions": {
    "nextMonth": {
      "totalSpending": number,
      "confidence": number,
      "categoryBreakdown": {
        "category": {
          "predicted": number,
          "confidence": number
        }
      }
    }
  },
  "trends": [
    {
      "category": "string",
      "trend": "increasing|decreasing|stable",
      "changePercentage": number,
      "insight": "string",
      "impact": "high|medium|low"
    }
  ],
  "anomalies": [
    {
      "date": "string",
      "category": "string",
      "amount": number,
      "expectedAmount": number,
      "severity": "high|medium|low",
      "description": "string"
    }
  ],
  "categoryInsights": [
    {
      "category": "string",
      "currentSpend": number,
      "avgSpend": number,
      "trend": "up|down|stable",
      "explanation": "string",
      "recommendation": "string"
    }
  ]
}

Rules:
1. Base predictions on historical patterns
2. Identify spending anomalies (>50% deviation from average)
3. Provide confidence scores (0-100)
4. Focus on actionable insights
5. Consider seasonal and cyclical patterns
`;

    const result = await genAI.models.generateContent({
      model: genAIModel,
      contents: [createUserContent([prompt])],
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });

    const response = result.text;
    const cleanedText = response?.replace(/```(?:json)?\n?/g, "").trim();
    
    if (!cleanedText) return null;
    
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating spending insights:", error);
    return null;
  }
};

export const generateSavingsStrategies = async (data: any) => {
  try {
    const prompt = `
You are an AI savings and investment advisor. Analyze financial data and provide personalized strategies.

Data: ${JSON.stringify(data)}

Provide a JSON response with:
{
  "savingsOpportunities": [
    {
      "category": "string",
      "currentSpend": number,
      "potentialSavings": number,
      "difficulty": "easy|medium|hard",
      "timeframe": "string",
      "description": "string",
      "action": "string"
    }
  ],
  "investmentReadiness": {
    "score": number,
    "factors": {
      "emergencyFund": boolean,
      "debtRatio": boolean,
      "stableIncome": boolean,
      "riskTolerance": boolean
    },
    "recommendation": "string",
    "suggestedAllocation": {
      "emergency": number,
      "debt": number,
      "investment": number
    }
  },
  "debtOptimization": [
    {
      "debtName": "string",
      "currentBalance": number,
      "interestRate": number,
      "suggestedStrategy": "avalanche|snowball",
      "monthlyPayment": number,
      "payoffTime": number,
      "interestSaved": number
    }
  ],
  "goalBasedRecommendations": [
    {
      "goalName": "string",
      "targetAmount": number,
      "timeframe": "string",
      "monthlyRequired": number,
      "strategy": "string",
      "riskLevel": "low|medium|high"
    }
  ]
}

Rules:
1. Prioritize high-impact, low-effort savings first
2. Emergency fund before investments
3. High-interest debt before low-yield investments
4. Consider risk tolerance and time horizon
5. Provide specific, actionable strategies
`;

    const result = await genAI.models.generateContent({
      model: genAIModel,
      contents: [createUserContent([prompt])],
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });

    const response = result.text;
    const cleanedText = response?.replace(/```(?:json)?\n?/g, "").trim();
    
    if (!cleanedText) return null;
    
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating savings strategies:", error);
    return null;
  }
};

export const generateLoanOptimization = async (loans: any[], monthlyIncome: number) => {
  try {
    const prompt = `
You are an AI loan optimization expert. Analyze loan portfolio and provide optimization strategies.

Data:
- Monthly Income: $${monthlyIncome}
- Loans: ${JSON.stringify(loans)}

Provide a JSON response with:
{
  "optimization": {
    "totalDebtReduction": number,
    "monthlySavings": number,
    "payoffAcceleration": number
  },
  "strategies": [
    {
      "strategy": "string",
      "description": "string",
      "impact": "high|medium|low",
      "implementation": "string"
    }
  ],
  "consolidationOpportunity": {
    "eligible": boolean,
    "newRate": number,
    "monthlySavings": number,
    "totalSavings": number
  },
  "payoffPlan": [
    {
      "loanId": "string",
      "priority": number,
      "reason": "string",
      "suggestedPayment": number,
      "payoffTime": number
    }
  ]
}

Rules:
1. Prioritize highest interest rate debts (avalanche method)
2. Consider debt consolidation opportunities
3. Maintain minimum payments on all debts
4. Factor in tax implications
5. Ensure debt-to-income ratio stays healthy
`;

    const result = await genAI.models.generateContent({
      model: genAIModel,
      contents: [createUserContent([prompt])],
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });

    const response = result.text;
    const cleanedText = response?.replace(/```(?:json)?\n?/g, "").trim();
    
    if (!cleanedText) return null;
    
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating loan optimization:", error);
    return null;
  }
};

export const generateGoalRecommendations = async (goals: any[], financialData: any) => {
  try {
    const prompt = `
You are an AI financial goal advisor. Analyze goals and financial capacity to provide optimization recommendations.

Data:
- Financial Goals: ${JSON.stringify(goals)}
- Financial Data: ${JSON.stringify(financialData)}

Provide a JSON response with:
{
  "goalOptimization": [
    {
      "goalId": "string",
      "currentProgress": number,
      "recommendedMonthly": number,
      "timeToGoal": number,
      "feasibility": "high|medium|low",
      "adjustments": "string"
    }
  ],
  "priorityRanking": [
    {
      "goalId": "string",
      "priority": number,
      "reasoning": "string"
    }
  ],
  "houseBuyingAdvice": {
    "readiness": "ready|almost|not_ready",
    "downPaymentTarget": number,
    "monthlyBudget": number,
    "timeframe": "string",
    "preparation": ["string"]
  },
  "sipRecommendations": {
    "monthlyAmount": number,
    "allocation": {
      "equity": number,
      "debt": number,
      "international": number
    },
    "expectedReturns": number,
    "riskProfile": "conservative|moderate|aggressive"
  }
}

Rules:
1. Emergency fund should be first priority
2. High-interest debt payoff before long-term goals
3. Consider time horizon for investment recommendations
4. Factor in inflation and market volatility
5. Provide realistic timelines and expectations
`;

    const result = await genAI.models.generateContent({
      model: genAIModel,
      contents: [createUserContent([prompt])],
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });

    const response = result.text;
    const cleanedText = response?.replace(/```(?:json)?\n?/g, "").trim();
    
    if (!cleanedText) return null;
    
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating goal recommendations:", error);
    return null;
  }
};
