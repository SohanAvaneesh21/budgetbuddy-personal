import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTransactionData } from "@/hooks/useTransactionData";
import { 
  Target, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Shield,
  Lightbulb,
  RefreshCw,
  PieChart,
  AlertCircle,
  AlertTriangle
} from "lucide-react";
import PageLayout from "@/components/page-layout";

interface BudgetCategory {
  name: string;
  current: number;
  suggested: number;
  percentage: number;
  trend: "up" | "down" | "stable";
  savings: number;
}

interface EmergencyFund {
  current: number;
  target: number;
  monthsOfExpenses: number;
  recommendedMonthly: number;
}

interface SeasonalAdjustment {
  month: string;
  category: string;
  adjustment: number;
  reason: string;
}

export default function AIBudgetOptimizerPage() {
  const { data, loading, error, refetch } = useTransactionData();
  
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
  const [emergencyFund, setEmergencyFund] = useState<EmergencyFund | null>(null);
  const [seasonalAdjustments, setSeasonalAdjustments] = useState<SeasonalAdjustment[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const generateBudgetOptimizations = () => {
    if (!data) return;

    const monthlyIncome = data.totalIncome / 12;
    const monthlyExpenses = data.totalExpenses / 12;

    // Calculate category-wise spending from real data
    const categorySpending = data.transactions.reduce((acc, transaction) => {
      if (transaction.type === 'EXPENSE') {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      }
      return acc;
    }, {} as Record<string, number>);

    // Convert to monthly averages
    const monthlyCategorySpending = Object.entries(categorySpending).map(([category, total]) => ({
      category,
      monthly: total / 12
    }));

    // Generate optimized budget suggestions using 50/30/20 rule as baseline
    const optimizedCategories: BudgetCategory[] = monthlyCategorySpending.map(({ category, monthly }) => {
      let suggestedPercentage = 0;
      let trend: "up" | "down" | "stable" = "stable";

      // AI-based category optimization
      switch (category.toLowerCase()) {
        case 'housing':
          suggestedPercentage = 30; // Max 30% for housing
          trend = monthly > monthlyIncome * 0.3 ? "down" : "stable";
          break;
        case 'food':
        case 'groceries':
          suggestedPercentage = 15; // 15% for food
          trend = monthly > monthlyIncome * 0.15 ? "down" : "stable";
          break;
        case 'transportation':
          suggestedPercentage = 10; // 10% for transport
          trend = monthly > monthlyIncome * 0.1 ? "down" : "stable";
          break;
        case 'utilities':
          suggestedPercentage = 5; // 5% for utilities
          trend = "stable";
          break;
        case 'entertainment':
          suggestedPercentage = 7; // 7% for entertainment
          trend = monthly > monthlyIncome * 0.07 ? "down" : "stable";
          break;
        case 'shopping':
          suggestedPercentage = 5; // 5% for shopping
          trend = monthly > monthlyIncome * 0.05 ? "down" : "stable";
          break;
        case 'healthcare':
          suggestedPercentage = 5; // 5% for healthcare
          trend = monthly < monthlyIncome * 0.05 ? "up" : "stable";
          break;
        default:
          suggestedPercentage = 3; // 3% for miscellaneous
          trend = "stable";
      }

      const suggested = monthlyIncome * (suggestedPercentage / 100);
      const savings = monthly - suggested;

      return {
        name: category,
        current: monthly,
        suggested,
        percentage: suggestedPercentage,
        trend,
        savings
      };
    });

    // Add savings category
    const currentSavingsRate = ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100;
    const targetSavingsRate = 20;
    const suggestedSavings = monthlyIncome * 0.2;
    const currentSavings = monthlyIncome - monthlyExpenses;

    optimizedCategories.push({
      name: 'Savings',
      current: currentSavings,
      suggested: suggestedSavings,
      percentage: targetSavingsRate,
      trend: currentSavingsRate < targetSavingsRate ? "up" : "stable",
      savings: suggestedSavings - currentSavings
    });

    setBudgetCategories(optimizedCategories);

    // Calculate emergency fund recommendations
    const emergencyTarget = monthlyExpenses * 6;
    const currentEmergency = Math.max(currentSavings * 3, 0); // Estimate current emergency fund
    const monthsOfExpenses = currentEmergency / monthlyExpenses;
    const recommendedMonthly = Math.max((emergencyTarget - currentEmergency) / 12, 0);

    setEmergencyFund({
      current: currentEmergency,
      target: emergencyTarget,
      monthsOfExpenses,
      recommendedMonthly
    });

    // Generate seasonal adjustments based on Indian festivals and seasons
    setSeasonalAdjustments([
      { month: "March", category: "Shopping", adjustment: 5000, reason: "Holi festival shopping" },
      { month: "April", category: "Shopping", adjustment: 3000, reason: "New Year celebrations" },
      { month: "August", category: "Shopping", adjustment: 4000, reason: "Independence Day and Raksha Bandhan" },
      { month: "October", category: "Shopping", adjustment: 8000, reason: "Diwali festival shopping" },
      { month: "November", category: "Entertainment", adjustment: 3000, reason: "Wedding season" },
      { month: "December", category: "Entertainment", adjustment: 4000, reason: "Christmas and New Year celebrations" }
    ]);
  };

  const optimizeBudget = async () => {
    setIsOptimizing(true);
    // Simulate AI optimization
    setTimeout(() => {
      generateBudgetOptimizations();
      setIsOptimizing(false);
    }, 2000);
  };

  useEffect(() => {
    if (data && !loading) {
      generateBudgetOptimizations();
    }
  }, [data, loading]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down": return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default: return <div className="h-4 w-4 rounded-full bg-gray-400" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up": return "text-green-600";
      case "down": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <PageLayout title="AI Budget Optimizer">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading your financial data...</span>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="AI Budget Optimizer">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load financial data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </PageLayout>
    );
  }

  const monthlyIncome = data ? data.totalIncome / 12 : 0;
  const monthlyExpenses = data ? data.totalExpenses / 12 : 0;
  const totalPotentialSavings = budgetCategories.reduce((sum, cat) => sum + Math.max(cat.savings, 0), 0);

  return (
    <PageLayout
      className="space-y-6"
      renderPageHeader={
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Budget Optimizer</h1>
            <p className="text-gray-600 mt-1">AI-powered budget optimization based on your real spending data</p>
          </div>
          <Button onClick={optimizeBudget} disabled={isOptimizing} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${isOptimizing ? 'animate-spin' : ''}`} />
            {isOptimizing ? 'Optimizing...' : 'Refresh Analysis'}
          </Button>
        </div>
      }
    >
      {/* Income & Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Monthly Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold">₹{monthlyIncome.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Potential Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold text-green-600">₹{totalPotentialSavings.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Per month with optimization</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Current Savings Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-purple-600" />
              <span className="text-2xl font-bold">
                {monthlyIncome > 0 ? (((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Target: 20%</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Categories Optimization */}
      {budgetCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              AI Budget Recommendations
            </CardTitle>
            <p className="text-sm text-gray-600">Optimized budget allocations based on your actual spending patterns</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {budgetCategories.map((category, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{category.name}</h3>
                      {getTrendIcon(category.trend)}
                    </div>
                    <Badge variant={category.trend === "up" ? "default" : category.trend === "down" ? "secondary" : "outline"}>
                      {category.percentage}% of income
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-xs text-gray-500">Current Monthly</div>
                      <div className="text-lg font-semibold">₹{category.current.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">AI Suggested</div>
                      <div className={`text-lg font-semibold ${getTrendColor(category.trend)}`}>
                        ₹{category.suggested.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Current Allocation</span>
                      <span>{monthlyIncome > 0 ? ((category.current / monthlyIncome) * 100).toFixed(1) : 0}%</span>
                    </div>
                    <Progress value={monthlyIncome > 0 ? (category.current / monthlyIncome) * 100 : 0} className="h-2" />
                  </div>

                  {Math.abs(category.savings) > 100 && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                      <div className="flex items-center gap-1">
                        <Lightbulb className="h-3 w-3 text-blue-600" />
                        <span className="font-medium text-blue-800">
                          {category.savings > 0 ? "Reduce" : "Increase"} by ₹
                          {Math.abs(category.savings).toLocaleString()} monthly
                          {category.savings > 0 && ` to save ₹${(category.savings * 12).toLocaleString()} annually`}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Emergency Fund Calculator */}
      {emergencyFund && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Emergency Fund Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium">Current Emergency Fund (Estimated)</div>
                  <div className="text-2xl font-bold text-blue-600">
                    ₹{emergencyFund.current.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">
                    Covers {emergencyFund.monthsOfExpenses.toFixed(1)} months of expenses
                  </p>
                </div>

                <div>
                  <div className="text-sm font-medium">Target Emergency Fund</div>
                  <div className="text-2xl font-bold text-green-600">
                    ₹{emergencyFund.target.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">6 months of expenses (recommended)</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-2 block">Progress to Target</div>
                  <Progress value={(emergencyFund.current / emergencyFund.target) * 100} className="h-3" />
                  <div className="flex justify-between text-xs mt-1">
                    <span>{((emergencyFund.current / emergencyFund.target) * 100).toFixed(1)}% Complete</span>
                    <span>₹{(emergencyFund.target - emergencyFund.current).toLocaleString()} remaining</span>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">AI Recommendation</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Save ₹{emergencyFund.recommendedMonthly.toLocaleString()} monthly to reach your target in{' '}
                    {Math.ceil((emergencyFund.target - emergencyFund.current) / emergencyFund.recommendedMonthly)} months
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Seasonal Adjustments */}
      {seasonalAdjustments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Seasonal Budget Adjustments
            </CardTitle>
            <p className="text-sm text-gray-600">AI predicts seasonal spending patterns for Indian festivals and occasions</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {seasonalAdjustments.map((adjustment, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{adjustment.month}</h3>
                    <Badge variant="outline">{adjustment.category}</Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    <span className="font-medium text-orange-700">
                      +₹{adjustment.adjustment.toLocaleString()} adjustment
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{adjustment.reason}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Budget Optimization Summary */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <TrendingUp className="h-5 w-5" />
            Optimization Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">₹{totalPotentialSavings.toLocaleString()}</div>
              <p className="text-sm text-gray-600">Monthly Savings Potential</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">₹{(totalPotentialSavings * 12).toLocaleString()}</div>
              <p className="text-sm text-gray-600">Annual Savings Potential</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {emergencyFund && emergencyFund.recommendedMonthly > 0 
                  ? Math.ceil((emergencyFund.target - emergencyFund.current) / (emergencyFund.recommendedMonthly + totalPotentialSavings))
                  : 'N/A'
                }
              </div>
              <p className="text-sm text-gray-600">Months to Emergency Goal</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
