import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTransactionData } from "@/hooks/useTransactionData";
import { 
  Heart, 
  TrendingUp, 
  AlertTriangle, 
  Shield,
  Lightbulb,
  RefreshCw,
  Target
} from "lucide-react";
import PageLayout from "@/components/page-layout";

interface HealthScore {
  overall: number;
  breakdown: {
    budgetAdherence: number;
    savingsRate: number;
    debtToIncome: number;
    emergencyFund: number;
  };
}

interface RiskAlert {
  type: 'high' | 'medium' | 'low';
  message: string;
  icon: React.ReactNode;
}

interface WellnessTip {
  category: string;
  tip: string;
  impact: 'high' | 'medium' | 'low';
}

interface FinancialGoal {
  title: string;
  current: number;
  target: number;
  timeframe: string;
  priority: 'high' | 'medium' | 'low';
}

export default function AIFinancialHealth() {
  const { transactions, analytics, loading, error } = useTransactionData();
  
  const [healthScore, setHealthScore] = useState<HealthScore | null>(null);
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>([]);
  const [wellnessTips, setWellnessTips] = useState<WellnessTip[]>([]);
  const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(0);
  const [emergencyFund, setEmergencyFund] = useState<number>(0);
  const [totalDebt, setTotalDebt] = useState<number>(0);
  
  const calculateHealthScore = () => {
    if (!monthlyIncome || !monthlyExpenses) return;
    
    const savingsRate = ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100;
    const emergencyMonths = emergencyFund / monthlyExpenses;
    const debtToIncomeRatio = (totalDebt / (monthlyIncome * 12)) * 100;
    
    const budgetAdherence = monthlyExpenses <= monthlyIncome ? 90 : 50;
    const savingsScore = Math.min(savingsRate * 4, 100);
    const emergencyScore = Math.min(emergencyMonths * 20, 100);
    const debtScore = Math.max(100 - debtToIncomeRatio, 0);
    
    const overall = (budgetAdherence + savingsScore + emergencyScore + debtScore) / 4;
    
    setHealthScore({
      overall: Math.round(overall),
      breakdown: {
        budgetAdherence: Math.round(budgetAdherence),
        savingsRate: Math.round(savingsScore),
        debtToIncome: Math.round(debtScore),
        emergencyFund: Math.round(emergencyScore),
        spendingConsistency: 85
      }
    });

    // Generate risk alerts based on calculations
    const alerts: RiskAlert[] = [];
    
    if (emergencyMonths < 3) {
      alerts.push({
        id: "1",
        type: "medium",
        title: "Emergency Fund Below Target",
        description: `Your emergency fund covers only ${emergencyMonths.toFixed(1)} months of expenses. Aim for 3-6 months.`,
        action: "Increase monthly emergency savings by ₹5,000"
      });
    }
    
    if (savingsRate < 20) {
      alerts.push({
        id: "2",
        type: "high",
        title: "Low Savings Rate",
        description: `Your savings rate is ${savingsRate.toFixed(1)}%. Aim for at least 20%.`,
        action: "Review and reduce discretionary expenses"
      });
    }
    
    setRiskAlerts(alerts);
  };

  const [wellnessTips, setWellnessTips] = useState<WellnessTip[]>([
    {
      id: "1",
      category: "Savings",
      tip: "Automate your savings by setting up a recurring transfer of ₹10,000 every month to your emergency fund.",
      impact: "high"
    },
    {
      id: "2",
      category: "Budgeting",
      tip: "Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings and debt repayment.",
      impact: "medium"
    },
    {
      id: "3",
      category: "Investment",
      tip: "Consider starting a SIP of ₹5,000 in diversified equity mutual funds for long-term wealth creation.",
      impact: "high"
    }
  ]);

  const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>([
    {
      id: "1",
      title: "Emergency Fund",
      target: 300000,
      current: 125000,
      deadline: "2025-12-31",
      progress: 42
    },
    {
      id: "2",
      title: "House Down Payment",
      target: 1500000,
      current: 450000,
      deadline: "2026-06-30",
      progress: 30
    },
    {
      id: "3",
      title: "Vacation Fund",
      target: 150000,
      current: 89000,
      deadline: "2025-03-15",
      progress: 59
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getRiskBadgeVariant = (type: string) => {
    switch (type) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "text-green-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-blue-600";
      default: return "text-gray-600";
    }
  };

  const refreshHealthData = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <PageLayout
      className="space-y-6"
      renderPageHeader={
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Financial Health Dashboard</h1>
            <p className="text-gray-600 mt-1">AI-powered insights into your financial wellness</p>
          </div>
          <Button onClick={refreshHealthData} disabled={isLoading} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Analysis
          </Button>
        </div>
      }
    >
      {/* Overall Health Score */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Heart className="h-6 w-6 text-red-500" />
            Financial Health Score
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="relative inline-block">
            <div className={`text-6xl font-bold ${getScoreColor(healthScore.overall)} mb-2`}>
              {healthScore.overall}
            </div>
            <div className="text-lg text-gray-600">out of 100</div>
          </div>
          <div className="mt-4">
            <Progress value={healthScore.overall} className="h-3" />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {healthScore.overall >= 80 ? "Excellent financial health!" : 
             healthScore.overall >= 60 ? "Good financial health with room for improvement" : 
             "Needs attention - focus on key areas below"}
          </p>
        </CardContent>
      </Card>

      {/* Health Score Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Health Score Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(healthScore.breakdown).map(([key, value]) => (
              <div key={key} className={`p-4 rounded-lg ${getScoreBackground(value)}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className={`text-lg font-bold ${getScoreColor(value)}`}>
                    {value}%
                  </span>
                </div>
                <Progress value={value} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Risk Assessment & Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskAlerts.map((alert) => (
              <div key={alert.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={getRiskBadgeVariant(alert.type)}>
                      {alert.type.toUpperCase()}
                    </Badge>
                    <h3 className="font-semibold">{alert.title}</h3>
                  </div>
                </div>
                <p className="text-gray-600 mb-2">{alert.description}</p>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Recommended Action:</span>
                  <span className="text-blue-600">{alert.action}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Financial Wellness Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Personalized Wellness Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wellnessTips.map((tip) => (
              <div key={tip.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{tip.category}</Badge>
                  <span className={`text-xs font-medium ${getImpactColor(tip.impact)}`}>
                    {tip.impact.toUpperCase()} IMPACT
                  </span>
                </div>
                <p className="text-sm text-gray-700">{tip.tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Goal Progress Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Financial Goals Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {financialGoals.map((goal) => (
              <div key={goal.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{goal.title}</h3>
                  <span className="text-sm text-gray-600">
                    Due: {new Date(goal.deadline).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">
                    ₹{goal.current.toLocaleString()} / ₹{goal.target.toLocaleString()}
                  </span>
                  <span className="text-sm font-medium text-blue-600">
                    {goal.progress}% Complete
                  </span>
                </div>
                <Progress value={goal.progress} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  ₹{(goal.target - goal.current).toLocaleString()} remaining
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
