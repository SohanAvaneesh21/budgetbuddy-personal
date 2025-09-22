import { useState, useEffect } from 'react';
import { getTransactions, getAnalytics } from '@/services/api';

interface Transaction {
  _id: string;
  title: string;
  amount: number;
  category: string;
  type: 'INCOME' | 'EXPENSE';
  date: string;
  createdAt: string;
  status: string;
  paymentMethod: string;
  description?: string;
}

interface TransactionData {
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
  monthlyAverage: {
    income: number;
    expenses: number;
  };
  categoryBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  emergencyFundMonths: number;
  transactions: Transaction[];
}

export const useTransactionData = () => {
  const [data, setData] = useState<TransactionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [transactions, analytics] = await Promise.all([
        getTransactions().catch(() => ({ data: [] })),
        getAnalytics().catch(() => ({ data: { categoryWiseExpense: [] } }))
      ]);

      // Ensure we have valid data arrays
      const transactionData = Array.isArray(transactions.data) ? transactions.data : [];
      const analyticsData = analytics.data || {};

      // Calculate financial metrics from real data
      const totalIncome = transactionData
        .filter((t: any) => t.type === 'INCOME')
        .reduce((sum: number, t: any) => sum + (t.amount || 0), 0);

      const totalExpenses = transactionData
        .filter((t: any) => t.type === 'EXPENSE')
        .reduce((sum: number, t: any) => sum + (t.amount || 0), 0);

      const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

      // Calculate monthly averages (assuming 12 months of data)
      const monthlyIncome = totalIncome / 12;
      const monthlyExpenses = totalExpenses / 12;

      // Category breakdown from analytics
      const categoryBreakdown = Array.isArray(analyticsData.categoryWiseExpense) 
        ? analyticsData.categoryWiseExpense 
        : [];

      // Estimate emergency fund (assuming 3 months expenses as baseline)
      const emergencyFundMonths = 3;

      setData({
        totalIncome,
        totalExpenses,
        savingsRate,
        monthlyAverage: {
          income: monthlyIncome,
          expenses: monthlyExpenses
        },
        categoryBreakdown,
        emergencyFundMonths,
        transactions: transactionData
      });
    } catch (err: any) {
      console.error('Error fetching transaction data:', err);
      setError(err.message || 'Failed to fetch transaction data');
      
      // Set fallback data to prevent complete failure
      setData({
        totalIncome: 0,
        totalExpenses: 0,
        savingsRate: 0,
        monthlyAverage: {
          income: 0,
          expenses: 0
        },
        categoryBreakdown: [],
        emergencyFundMonths: 3,
        transactions: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};
