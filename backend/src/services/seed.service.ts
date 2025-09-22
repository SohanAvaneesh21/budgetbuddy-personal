import TransactionModel from "../models/transaction.model";
import { TransactionTypeEnum } from "../models/transaction.model";

interface SeedTransaction {
  amount: number;
  title: string;
  description: string;
  category: string;
  type: TransactionTypeEnum;
  date: Date;
}

export const seedUserTransactions = async (userId: string, forceReseed = false) => {
  // Check if user already has transactions
  const existingTransactions = await TransactionModel.countDocuments({ userId });
  if (existingTransactions > 0 && !forceReseed) {
    return { message: "User already has transactions" };
  }
  
  // If force reseeding, delete existing transactions
  if (forceReseed && existingTransactions > 0) {
    await TransactionModel.deleteMany({ userId });
  }

  // Indian middle-class software employee (₹1 lakh salary, family of 3)
  const transactions: SeedTransaction[] = [];
  const currentDate = new Date();
  
  // Generate transactions for the last 12 months
  for (let month = 0; month < 12; month++) {
    const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - month, 1);
    
    // Monthly Income
    transactions.push({
      amount: 100000,
      title: "Software Engineer Salary",
      description: "Monthly salary from tech company",
      category: "Salary",
      type: TransactionTypeEnum.INCOME,
      date: new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)
    });

    // Monthly Expenses
    const monthlyExpenses = [
      // Housing (25-30%)
      { amount: 28000, description: "House Rent", category: "Housing" },
      { amount: 2500, description: "Electricity Bill", category: "Utilities" },
      { amount: 800, description: "Water Bill", category: "Utilities" },
      { amount: 1200, description: "Internet & Cable", category: "Utilities" },
      
      // Food & Groceries (12-15%)
      { amount: 8500, description: "Monthly Groceries", category: "Groceries" },
      { amount: 4200, description: "Dining Out", category: "Food" },
      { amount: 1800, description: "Online Food Orders", category: "Food" },
      
      // Transportation (5-8%)
      { amount: 3500, description: "Petrol", category: "Transportation" },
      { amount: 1200, description: "Car Maintenance", category: "Transportation" },
      { amount: 800, description: "Auto/Cab Rides", category: "Transportation" },
      
      // Healthcare (3-5%)
      { amount: 2200, description: "Health Insurance Premium", category: "Healthcare" },
      { amount: 1500, description: "Medical Expenses", category: "Healthcare" },
      { amount: 800, description: "Medicines", category: "Healthcare" },
      
      // Education & Child (8-12%)
      { amount: 6500, description: "School Fees", category: "Education" },
      { amount: 3000, description: "Tuition Classes", category: "Education" },
      { amount: 1200, description: "Books & Stationery", category: "Education" },
      
      // Entertainment (3-5%)
      { amount: 2000, description: "Movie & Entertainment", category: "Entertainment" },
      { amount: 1500, description: "Streaming Subscriptions", category: "Entertainment" },
      { amount: 1200, description: "Weekend Outings", category: "Entertainment" },
      
      // Personal Care (2-3%)
      { amount: 1800, description: "Personal Care Items", category: "Personal Care" },
      { amount: 1200, description: "Salon & Grooming", category: "Personal Care" },
      
      // Miscellaneous (5-8%)
      { amount: 2500, description: "Mobile Recharge", category: "Utilities" },
      { amount: 1800, description: "Clothing", category: "Shopping" },
      { amount: 2200, description: "Household Items", category: "Shopping" },
      { amount: 1500, description: "Gifts & Donations", category: "Others" },
      
      // Investments & Savings (15-20%)
      { amount: 8000, description: "SIP Mutual Funds", category: "Investment" },
      { amount: 5000, description: "PPF Contribution", category: "Investment" },
      { amount: 3000, description: "Emergency Fund", category: "Savings" },
      { amount: 2000, description: "Fixed Deposit", category: "Savings" }
    ];

    // Add expenses with some variation
    monthlyExpenses.forEach((expense, index) => {
      const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
      const amount = Math.round(expense.amount * (1 + variation));
      const day = Math.min(28, 5 + (index % 23)); // Spread across the month
      
      transactions.push({
        amount,
        title: expense.description,
        description: `Monthly ${expense.description.toLowerCase()}`,
        category: expense.category,
        type: TransactionTypeEnum.EXPENSE,
        date: new Date(monthDate.getFullYear(), monthDate.getMonth(), day)
      });
    });

    // Add some random additional expenses
    const randomExpenses = [
      { amount: 1500, description: "ATM Withdrawal", category: "Others" },
      { amount: 800, description: "Coffee Shop", category: "Food" },
      { amount: 2200, description: "Online Shopping", category: "Shopping" },
      { amount: 1200, description: "Pharmacy", category: "Healthcare" },
      { amount: 900, description: "Parking Fees", category: "Transportation" }
    ];

    // Add 2-3 random expenses per month
    const numRandomExpenses = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < numRandomExpenses; i++) {
      const randomExpense = randomExpenses[Math.floor(Math.random() * randomExpenses.length)];
      const day = Math.floor(Math.random() * 28) + 1;
      
      transactions.push({
        amount: randomExpense.amount,
        title: randomExpense.description,
        description: `Random ${randomExpense.description.toLowerCase()}`,
        category: randomExpense.category,
        type: TransactionTypeEnum.EXPENSE,
        date: new Date(monthDate.getFullYear(), monthDate.getMonth(), day)
      });
    }
  }

  // Add bonus income (quarterly)
  for (let quarter = 0; quarter < 4; quarter++) {
    const quarterDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - (quarter * 3), 15);
    transactions.push({
      amount: 25000,
      title: "Quarterly Bonus",
      description: "Performance-based quarterly bonus",
      category: "Bonus",
      type: TransactionTypeEnum.INCOME,
      date: quarterDate
    });
  }

  // Festival expenses (Diwali, etc.)
  transactions.push({
    amount: 15000,
    title: "Diwali Shopping",
    description: "Festival shopping and celebrations",
    category: "Festival",
    type: TransactionTypeEnum.EXPENSE,
    date: new Date(currentDate.getFullYear(), 9, 20) // October
  });

  transactions.push({
    amount: 8000,
    title: "Holi Celebration",
    description: "Festival celebration expenses",
    category: "Festival",
    type: TransactionTypeEnum.EXPENSE,
    date: new Date(currentDate.getFullYear(), 2, 15) // March
  });

  // Create transactions in database
  const transactionDocs = transactions.map(t => ({
    ...t,
    userId,
    createdAt: t.date,
    updatedAt: t.date
  }));

  await TransactionModel.insertMany(transactionDocs);

  return {
    message: "Successfully seeded transactions",
    count: transactions.length,
    totalIncome: transactions.filter(t => t.type === TransactionTypeEnum.INCOME).reduce((sum, t) => sum + t.amount, 0),
    totalExpenses: transactions.filter(t => t.type === TransactionTypeEnum.EXPENSE).reduce((sum, t) => sum + t.amount, 0)
  };
};
