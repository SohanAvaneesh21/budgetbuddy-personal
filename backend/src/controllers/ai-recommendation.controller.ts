import { Request, Response } from "express";
import { 
  generateFinancialHealthScore,
  generateBudgetOptimization,
  generateSpendingInsights,
  generateSavingsStrategies,
  generateLoanOptimization,
  generateGoalRecommendations
} from "../services/ai-recommendation.service";
import { getAllTransactionService } from "../services/transaction.service";

export const getFinancialHealthScore = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get user's financial data
    const transactionData = await getAllTransactionService(userId, {}, { pageSize: 1000, pageNumber: 1 });
    const transactions = transactionData.transations;
    
    // Calculate financial metrics
    const totalIncome = transactions
      .filter((t: any) => t.type === 'income')
      .reduce((sum: number, t: any) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter((t: any) => t.type === 'expense')
      .reduce((sum: number, t: any) => sum + t.amount, 0);
    
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
    
    // Calculate category breakdown
    const categories: Record<string, { amount: number; percentage: number }> = {};
    const expenseTransactions = transactions.filter((t: any) => t.type === 'expense');
    
    expenseTransactions.forEach(transaction => {
      const category = transaction.category || 'Other';
      if (!categories[category]) {
        categories[category] = { amount: 0, percentage: 0 };
      }
      categories[category].amount += transaction.amount;
    });
    
    // Calculate percentages
    Object.keys(categories).forEach(category => {
      categories[category].percentage = totalExpenses > 0 
        ? (categories[category].amount / totalExpenses) * 100 
        : 0;
    });

    const financialData = {
      totalIncome,
      totalExpenses,
      savingsRate,
      debtToIncomeRatio: 25, // This would come from user's debt data
      emergencyFundMonths: 2, // This would come from user's savings data
      categories
    };

    const healthScore = await generateFinancialHealthScore(financialData);
    
    if (!healthScore) {
      return res.status(500).json({ message: "Failed to generate health score" });
    }

    res.json(healthScore);
  } catch (error) {
    console.error("Error in getFinancialHealthScore:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBudgetOptimization = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const transactionData = await getAllTransactionService(userId, {}, { pageSize: 1000, pageNumber: 1 });
    const transactions = transactionData.transations;
    
    const monthlyIncome = transactions
      .filter((t: any) => t.type === 'income')
      .reduce((sum: number, t: any) => sum + t.amount, 0);
    
    // Calculate current budget by category
    const currentBudget: Record<string, number> = {};
    transactions
      .filter((t: any) => t.type === 'expense')
      .forEach((transaction: any) => {
        const category = transaction.category || 'Other';
        currentBudget[category] = (currentBudget[category] || 0) + transaction.amount;
      });

    const budgetData = {
      monthlyIncome,
      currentBudget,
      financialGoals: [
        { name: "Emergency Fund", targetAmount: 10000, currentAmount: 2000, deadline: "2024-12-31" },
        { name: "Vacation", targetAmount: 5000, currentAmount: 500, deadline: "2024-06-30" }
      ]
    };

    const optimization = await generateBudgetOptimization(budgetData);
    
    if (!optimization) {
      return res.status(500).json({ message: "Failed to generate budget optimization" });
    }

    res.json(optimization);
  } catch (error) {
    console.error("Error in getBudgetOptimization:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSpendingInsights = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const transactionData = await getAllTransactionService(userId, {}, { pageSize: 1000, pageNumber: 1 });
    const transactions = transactionData.transations;
    
    const monthlyTransactions = transactions.map((t: any) => ({
      date: t.date.toISOString(),
      amount: t.amount,
      category: t.category || 'Other',
      description: t.description || ''
    }));

    // Calculate historical monthly spending
    const historicalData: Record<string, number> = {};
    const monthlyTotals = new Map<string, number>();
    
    transactions.forEach((transaction: any) => {
      if (transaction.type === 'expense') {
        const monthKey = transaction.date.toISOString().substring(0, 7); // YYYY-MM
        monthlyTotals.set(monthKey, (monthlyTotals.get(monthKey) || 0) + transaction.amount);
      }
    });
    
    monthlyTotals.forEach((amount, month) => {
      historicalData[month] = amount;
    });

    const insightData = {
      monthlyTransactions,
      historicalData
    };

    const insights = await generateSpendingInsights(insightData);
    
    if (!insights) {
      return res.status(500).json({ message: "Failed to generate spending insights" });
    }

    res.json(insights);
  } catch (error) {
    console.error("Error in getSpendingInsights:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSavingsStrategies = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const transactionData = await getAllTransactionService(userId, {}, { pageSize: 1000, pageNumber: 1 });
    const transactions = transactionData.transations;
    
    const totalIncome = transactions
      .filter((t: any) => t.type === 'income')
      .reduce((sum: number, t: any) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter((t: any) => t.type === 'expense')
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    const savingsData = {
      monthlyIncome: totalIncome,
      monthlyExpenses: totalExpenses,
      currentSavings: 5000, // This would come from user's savings account data
      emergencyFund: 2000,
      debts: [
        { name: "Credit Card", balance: 3000, interestRate: 18.5, minPayment: 150 }
      ],
      goals: [
        { name: "House Down Payment", target: 50000, current: 10000, deadline: "2026-01-01" }
      ]
    };

    const strategies = await generateSavingsStrategies(savingsData);
    
    if (!strategies) {
      return res.status(500).json({ message: "Failed to generate savings strategies" });
    }

    res.json(strategies);
  } catch (error) {
    console.error("Error in getSavingsStrategies:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getLoanOptimization = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const transactionData = await getAllTransactionService(userId, {}, { pageSize: 1000, pageNumber: 1 });
    const transactions = transactionData.transations;
    
    const monthlyIncome = transactions
      .filter((t: any) => t.type === 'income')
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    // Mock loan data - in real app, this would come from user's loan accounts
    const loans = [
      {
        id: "1",
        name: "Home Loan",
        balance: 250000,
        interestRate: 6.5,
        monthlyPayment: 1600,
        term: 30
      },
      {
        id: "2", 
        name: "Car Loan",
        balance: 15000,
        interestRate: 4.2,
        monthlyPayment: 350,
        term: 5
      },
      {
        id: "3",
        name: "Credit Card",
        balance: 5000,
        interestRate: 18.5,
        monthlyPayment: 200,
        term: 0
      }
    ];

    const optimization = await generateLoanOptimization(loans, monthlyIncome);
    
    if (!optimization) {
      return res.status(500).json({ message: "Failed to generate loan optimization" });
    }

    res.json(optimization);
  } catch (error) {
    console.error("Error in getLoanOptimization:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getGoalRecommendations = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const transactionData = await getAllTransactionService(userId, {}, { pageSize: 1000, pageNumber: 1 });
    const transactions = transactionData.transations;
    
    const monthlyIncome = transactions
      .filter((t: any) => t.type === 'income')
      .reduce((sum: number, t: any) => sum + t.amount, 0);
    
    const monthlyExpenses = transactions
      .filter((t: any) => t.type === 'expense')
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    // Mock goals data
    const goals = [
      {
        id: "1",
        name: "Emergency Fund",
        targetAmount: 15000,
        currentAmount: 3000,
        deadline: "2024-12-31",
        priority: 1
      },
      {
        id: "2",
        name: "House Down Payment", 
        targetAmount: 60000,
        currentAmount: 12000,
        deadline: "2026-06-01",
        priority: 2
      },
      {
        id: "3",
        name: "Retirement",
        targetAmount: 500000,
        currentAmount: 25000,
        deadline: "2050-01-01",
        priority: 3
      }
    ];

    const financialData = {
      monthlyIncome,
      monthlyExpenses,
      currentSavings: monthlyIncome - monthlyExpenses,
      age: 30,
      riskTolerance: "moderate"
    };

    const recommendations = await generateGoalRecommendations(goals, financialData);
    
    if (!recommendations) {
      return res.status(500).json({ message: "Failed to generate goal recommendations" });
    }

    res.json(recommendations);
  } catch (error) {
    console.error("Error in getGoalRecommendations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
