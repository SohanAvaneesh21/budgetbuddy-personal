import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Shield,
  Lightbulb,
  RefreshCw,
  PieChart,
  AlertCircle
} from "lucide-react";
import PageLayout from "@/components/page-layout";

interface BudgetCategory {
  name: string;
  current: number;
  suggested: number;
  percentage: number;
  trend: "up" | "down" | "stable";
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
  const [monthlyIncome, setMonthlyIncome] = useState<number>(75000);
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([
    { name: "Housing", current: 25000, suggested: 22500, percentage: 30, trend: "down" },
    { name: "Food & Dining", current: 12000, suggested: 11250, percentage: 15, trend: "down" },
    { name: "Transportation", current: 8000, suggested: 7500, percentage: 10, trend: "down" },
    { name: "Utilities", current: 4000, suggested: 3750, percentage: 5, trend: "stable" },
    { name: "Entertainment", current: 6000, suggested: 5625, percentage: 7.5, trend: "down" },
    { name: "Shopping", current: 5000, suggested: 3750, percentage: 5, trend: "down" },
    { name: "Healthcare", current: 3000, suggested: 3750, percentage: 5, trend: "up" },
    { name: "Savings", current: 10000, suggested: 15000, percentage: 20, trend: "up" },
    { name: "Miscellaneous", current: 2000, suggested: 1875, percentage: 2.5, trend: "down" }
  ]);

  const [emergencyFund, setEmergencyFund] = useState<EmergencyFund>({
    current: 125000,
    target: 300000,
    monthsOfExpenses: 2.1,
    recommendedMonthly: 8750
  });

  const [seasonalAdjustments, setSeasonalAdjustments] = useState<SeasonalAdjustment[]>([
    { month: "December", category: "Entertainment", adjustment: 3000, reason: "Holiday celebrations and gifts" },
    { month: "April", category: "Shopping", adjustment: 2000, reason: "Festival shopping season" },
    { month: "June", category: "Travel", adjustment: 5000, reason: "Summer vacation season" },
    { month: "October", category: "Shopping", adjustment: 1500, reason: "Festive season shopping" }
  ]);

  const [isOptimizing, setIsOptimizing] = useState(false);

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

  const optimizeBudget = async () => {
    setIsOptimizing(true);
    // Simulate AI optimization
    setTimeout(() => {
      setIsOptimizing(false);
    }, 3000);
  };

  const totalCurrentSpending = budgetCategories.reduce((sum, cat) => sum + cat.current, 0);
  const totalSuggestedSpending = budgetCategories.reduce((sum, cat) => sum + cat.suggested, 0);
  const potentialSavings = totalCurrentSpending - totalSuggestedSpending;

  return (
    <PageLayout
      className="space-y-6"
      renderPageHeader={
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Budget Optimizer</h1>
            <p className="text-gray-600 mt-1">AI-powered budget optimization and recommendations</p>
          </div>
          <Button onClick={optimizeBudget} disabled={isOptimizing} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${isOptimizing ? 'animate-spin' : ''}`} />
            Optimize Budget
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
              <span className="text-2xl font-bold text-green-600">₹{potentialSavings.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Per month with optimization</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Budget Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-purple-600" />
              <span className="text-2xl font-bold">87%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Room for improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Categories Optimization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Dynamic Budget Suggestions
          </CardTitle>
          <p className="text-sm text-gray-600">AI-recommended budget allocations based on your spending patterns</p>
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
                    <Label className="text-xs text-gray-500">Current</Label>
                    <div className="text-lg font-semibold">₹{category.current.toLocaleString()}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">AI Suggested</Label>
                    <div className={`text-lg font-semibold ${getTrendColor(category.trend)}`}>
                      ₹{category.suggested.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Current Allocation</span>
                    <span>{((category.current / monthlyIncome) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={(category.current / monthlyIncome) * 100} className="h-2" />
                </div>

                {category.current !== category.suggested && (
                  <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                    <div className="flex items-center gap-1">
                      <Lightbulb className="h-3 w-3 text-blue-600" />
                      <span className="font-medium text-blue-800">
                        {category.suggested > category.current ? "Increase" : "Reduce"} by ₹
                        {Math.abs(category.suggested - category.current).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Fund Calculator */}
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
                <Label className="text-sm font-medium">Current Emergency Fund</Label>
                <div className="text-2xl font-bold text-blue-600">
                  ₹{emergencyFund.current.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600">
                  Covers {emergencyFund.monthsOfExpenses} months of expenses
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium">Target Emergency Fund</Label>
                <div className="text-2xl font-bold text-green-600">
                  ₹{emergencyFund.target.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600">6 months of expenses (recommended)</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Progress to Target</Label>
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
                  Save ₹{emergencyFund.recommendedMonthly.toLocaleString()} monthly to reach your target in 20 months
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seasonal Adjustments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            Seasonal Budget Adjustments
          </CardTitle>
          <p className="text-sm text-gray-600">AI predicts seasonal spending patterns and suggests adjustments</p>
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
              <div className="text-2xl font-bold text-green-600">₹{potentialSavings.toLocaleString()}</div>
              <p className="text-sm text-gray-600">Monthly Savings</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">₹{(potentialSavings * 12).toLocaleString()}</div>
              <p className="text-sm text-gray-600">Annual Savings</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.ceil((emergencyFund.target - emergencyFund.current) / (emergencyFund.recommendedMonthly + potentialSavings))}
              </div>
              <p className="text-sm text-gray-600">Months to Emergency Goal</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
