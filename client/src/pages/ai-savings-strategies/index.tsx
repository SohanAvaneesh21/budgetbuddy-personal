import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTransactionData } from "@/hooks/useTransactionData";
import { 
  PiggyBank, 
  TrendingUp, 
  Target,
  DollarSign,
  Calculator,
  Lightbulb,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  BarChart3
} from "lucide-react";
import PageLayout from "@/components/page-layout";

interface SavingsOpportunity {
  id: string;
  category: string;
  currentSpend: number;
  potentialSavings: number;
  difficulty: "easy" | "medium" | "hard";
  timeframe: string;
  description: string;
  action: string;
}

interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  timeToGoal: number;
  priority: "high" | "medium" | "low";
}

interface InvestmentReadiness {
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
}

interface DebtPayoffPlan {
  id: string;
  debtName: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
  suggestedPayment: number;
  payoffTime: number;
  totalInterest: number;
  strategy: "avalanche" | "snowball";
}

export default function AISavingsStrategiesPage() {
  const { data, loading, error } = useTransactionData();
  
  const [savingsOpportunities, setSavingsOpportunities] = useState<SavingsOpportunity[]>([
    {
      id: "1",
      category: "Subscriptions",
      currentSpend: 2800,
      potentialSavings: 900,
      difficulty: "easy",
      timeframe: "Immediate",
      description: "Cancel unused streaming and software subscriptions",
      action: "Review and cancel 3 unused subscriptions"
    },
    {
      id: "2",
      category: "Dining Out",
      currentSpend: 8000,
      potentialSavings: 2400,
      difficulty: "medium",
      timeframe: "1-2 months",
      description: "Reduce dining frequency and cook more at home",
      action: "Limit dining out to 2 times per week"
    },
    {
      id: "3",
      category: "Utilities",
      currentSpend: 4200,
      potentialSavings: 630,
      difficulty: "easy",
      timeframe: "1 month",
      description: "Switch to energy-efficient appliances and optimize usage",
      action: "Install LED bulbs and smart thermostat"
    },
    {
      id: "4",
      category: "Transportation",
      currentSpend: 6500,
      potentialSavings: 1300,
      difficulty: "hard",
      timeframe: "3-6 months",
      description: "Use public transport or carpooling options",
      action: "Replace 40% of car trips with alternatives"
    }
  ]);

  const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>([
    {
      id: "1",
      title: "Emergency Fund",
      targetAmount: 300000,
      currentAmount: 125000,
      monthlyContribution: 8750,
      timeToGoal: 20,
      priority: "high"
    },
    {
      id: "2",
      title: "House Down Payment",
      targetAmount: 1500000,
      currentAmount: 450000,
      monthlyContribution: 25000,
      timeToGoal: 42,
      priority: "high"
    },
    {
      id: "3",
      title: "Retirement Fund",
      targetAmount: 5000000,
      currentAmount: 180000,
      monthlyContribution: 15000,
      timeToGoal: 267,
      priority: "medium"
    }
  ]);

  const [investmentReadiness, setInvestmentReadiness] = useState<InvestmentReadiness>({
    score: 72,
    factors: {
      emergencyFund: false,
      debtRatio: true,
      stableIncome: true,
      riskTolerance: true
    },
    recommendation: "Build emergency fund before increasing investments",
    suggestedAllocation: {
      emergency: 40,
      debt: 20,
      investment: 40
    }
  });

  const [debtPayoffPlans, setDebtPayoffPlans] = useState<DebtPayoffPlan[]>([
    {
      id: "1",
      debtName: "Credit Card",
      balance: 85000,
      interestRate: 18,
      minimumPayment: 2550,
      suggestedPayment: 5000,
      payoffTime: 20,
      totalInterest: 15200,
      strategy: "avalanche"
    },
    {
      id: "2",
      debtName: "Personal Loan",
      balance: 150000,
      interestRate: 12,
      minimumPayment: 4200,
      suggestedPayment: 6000,
      payoffTime: 28,
      totalInterest: 18500,
      strategy: "avalanche"
    }
  ]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-600 bg-green-50 border-green-200";
      case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "hard": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const refreshStrategies = async () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 3000);
  };

  const totalPotentialSavings = savingsOpportunities.reduce((sum, opp) => sum + opp.potentialSavings, 0);

  return (
    <PageLayout
      className="space-y-6"
      renderPageHeader={
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Personalized Savings Strategies</h1>
            <p className="text-gray-600 mt-1">AI-powered savings opportunities and financial planning</p>
          </div>
          <Button onClick={refreshStrategies} disabled={isAnalyzing} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            Refresh Strategies
          </Button>
        </div>
      }
    >
      {/* Savings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Potential Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <PiggyBank className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">₹{totalPotentialSavings.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Per month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Annual Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">₹{(totalPotentialSavings * 12).toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Yearly savings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Investment Readiness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <span className="text-2xl font-bold text-purple-600">{investmentReadiness.score}%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Ready to invest</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Active Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-600" />
              <span className="text-2xl font-bold text-orange-600">{financialGoals.length}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Financial goals</p>
          </CardContent>
        </Card>
      </div>

      {/* Savings Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            AI-Identified Savings Opportunities
          </CardTitle>
          <p className="text-sm text-gray-600">Personalized recommendations to optimize your spending</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {savingsOpportunities.map((opportunity) => (
              <div key={opportunity.id} className={`border rounded-lg p-4 ${getDifficultyColor(opportunity.difficulty)}`}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold">{opportunity.category}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{opportunity.timeframe}</Badge>
                    <Badge variant={opportunity.difficulty === "easy" ? "default" : opportunity.difficulty === "medium" ? "secondary" : "destructive"}>
                      {opportunity.difficulty.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <span className="text-xs">Current Spending</span>
                    <div className="text-lg font-semibold">₹{opportunity.currentSpend.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-xs">Potential Savings</span>
                    <div className="text-lg font-semibold text-green-600">₹{opportunity.potentialSavings.toLocaleString()}</div>
                  </div>
                </div>

                <p className="text-sm mb-2">{opportunity.description}</p>
                
                <div className="flex items-center gap-2 p-2 bg-white/50 rounded">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Action:</span>
                  <span className="text-sm">{opportunity.action}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Goal-Based Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Goal-Based Recommendations
          </CardTitle>
          <p className="text-sm text-gray-600">Tailored advice for your specific financial goals</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {financialGoals.map((goal) => (
              <div key={goal.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold">{goal.title}</h3>
                  <Badge variant={getPriorityBadge(goal.priority)}>
                    {goal.priority.toUpperCase()} PRIORITY
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <span className="text-xs text-gray-500">Target</span>
                    <div className="font-semibold">₹{goal.targetAmount.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Current</span>
                    <div className="font-semibold">₹{goal.currentAmount.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Monthly</span>
                    <div className="font-semibold text-blue-600">₹{goal.monthlyContribution.toLocaleString()}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span>{((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={(goal.currentAmount / goal.targetAmount) * 100} className="h-2" />
                  <p className="text-xs text-gray-500">
                    {goal.timeToGoal} months to reach goal at current rate
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Investment Readiness Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Investment Readiness Assessment
          </CardTitle>
          <p className="text-sm text-gray-600">AI assesses when you're ready to invest</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">{investmentReadiness.score}%</div>
                <p className="text-sm text-gray-600">Investment Ready Score</p>
                <Progress value={investmentReadiness.score} className="h-3 mt-2" />
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Readiness Factors</h4>
                {Object.entries(investmentReadiness.factors).map(([factor, status]) => (
                  <div key={factor} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{factor.replace(/([A-Z])/g, ' $1').trim()}</span>
                    {status ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">AI Recommendation</h4>
                <p className="text-sm text-blue-700">{investmentReadiness.recommendation}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Suggested Allocation</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Emergency Fund</span>
                    <span className="font-semibold">{investmentReadiness.suggestedAllocation.emergency}%</span>
                  </div>
                  <Progress value={investmentReadiness.suggestedAllocation.emergency} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Debt Repayment</span>
                    <span className="font-semibold">{investmentReadiness.suggestedAllocation.debt}%</span>
                  </div>
                  <Progress value={investmentReadiness.suggestedAllocation.debt} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Investments</span>
                    <span className="font-semibold">{investmentReadiness.suggestedAllocation.investment}%</span>
                  </div>
                  <Progress value={investmentReadiness.suggestedAllocation.investment} className="h-2" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Debt Payoff Strategies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-red-600" />
            Optimized Debt Payoff Plans
          </CardTitle>
          <p className="text-sm text-gray-600">AI-optimized strategies for debt elimination</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {debtPayoffPlans.map((debt) => (
              <div key={debt.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold">{debt.debtName}</h3>
                  <Badge variant="outline">{debt.strategy.toUpperCase()} METHOD</Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <span className="text-xs text-gray-500">Balance</span>
                    <div className="font-semibold text-red-600">₹{debt.balance.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Interest Rate</span>
                    <div className="font-semibold">{debt.interestRate}%</div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Minimum Payment</span>
                    <div className="font-semibold">₹{debt.minimumPayment.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Suggested Payment</span>
                    <div className="font-semibold text-green-600">₹{debt.suggestedPayment.toLocaleString()}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 rounded">
                    <span className="text-xs text-green-600">Payoff Time</span>
                    <div className="font-semibold text-green-800">{debt.payoffTime} months</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded">
                    <span className="text-xs text-blue-600">Total Interest</span>
                    <div className="font-semibold text-blue-800">₹{debt.totalInterest.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Savings Impact Summary */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <DollarSign className="h-5 w-5" />
            Savings Strategy Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">₹{totalPotentialSavings.toLocaleString()}</div>
              <p className="text-sm text-gray-600">Monthly Savings Potential</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.ceil((300000 - 125000) / (8750 + totalPotentialSavings))}
              </div>
              <p className="text-sm text-gray-600">Months to Emergency Fund</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">₹{((totalPotentialSavings * 12) * 5).toLocaleString()}</div>
              <p className="text-sm text-gray-600">5-Year Wealth Impact</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
