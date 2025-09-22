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
  const { data, loading, error, refetch } = useTransactionData();
  
  const [healthScore, setHealthScore] = useState<HealthScore | null>(null);
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>([]);
  const [wellnessTips, setWellnessTips] = useState<WellnessTip[]>([]);
  const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const calculateHealthScore = (monthlyIncome: number, monthlyExpenses: number, totalSavings: number): HealthScore => {
    const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;
    const emergencyMonths = monthlyExpenses > 0 ? totalSavings / monthlyExpenses : 0;

    const savingsScore = Math.min(Math.max(savingsRate * 5, 0), 100); // 20% savings = 100 points
    const emergencyScore = Math.min(emergencyMonths * 16.67, 100); // 6 months = 100 points
    const budgetScore = monthlyExpenses <= monthlyIncome ? 100 : Math.max(100 - ((monthlyExpenses - monthlyIncome) / monthlyIncome) * 200, 0);
    const debtScore = 85; // Assume good debt management for now

    const overall = (savingsScore + debtScore + emergencyScore + budgetScore) / 4;

    return {
      overall: Math.round(overall),
      breakdown: {
        budgetAdherence: Math.round(budgetScore),
        savingsRate: Math.round(savingsScore),
        debtToIncome: Math.round(debtScore),
        emergencyFund: Math.round(emergencyScore),
      },
    };
  };

  const generateRiskAlerts = (score: HealthScore, monthlyIncome: number, monthlyExpenses: number): RiskAlert[] => {
    const alerts: RiskAlert[] = [];

    if (score.breakdown.budgetAdherence < 50) {
      alerts.push({
        type: 'high',
        message: 'Your expenses exceed your income. Immediate budget revision needed.',
        icon: <AlertTriangle className="h-4 w-4" />,
      });
    }

    if (score.breakdown.emergencyFund < 30) {
      alerts.push({
        type: 'medium',
        message: 'Low emergency fund. Aim for 3-6 months of expenses.',
        icon: <Shield className="h-4 w-4" />,
      });
    }

    if (score.breakdown.savingsRate < 40) {
      alerts.push({
        type: 'medium',
        message: 'Low savings rate. Try to save at least 20% of your income.',
        icon: <TrendingUp className="h-4 w-4" />,
      });
    }

    return alerts;
  };

  const generateWellnessTips = (savingsRate: number, monthlyExpenses: number): WellnessTip[] => {
    const tips: WellnessTip[] = [
      {
        category: 'Budgeting',
        tip: 'Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings',
        impact: 'high',
      },
      {
        category: 'Emergency Fund',
        tip: 'Start with ₹1,000 emergency fund, then build to 3-6 months expenses',
        impact: 'high',
      },
    ];

    if (savingsRate < 20) {
      tips.push({
        category: 'Savings',
        tip: 'Automate your savings to reach 20% of income consistently',
        impact: 'high',
      });
    }

    if (monthlyExpenses > 80000) {
      tips.push({
        category: 'Expenses',
        tip: 'Review your top expense categories for optimization opportunities',
        impact: 'medium',
      });
    }

    return tips;
  };

  const generateFinancialGoals = (monthlyIncome: number, monthlyExpenses: number, currentSavings: number): FinancialGoal[] => {
    return [
      {
        title: 'Emergency Fund',
        current: currentSavings,
        target: monthlyExpenses * 6,
        timeframe: '12 months',
        priority: 'high',
      },
      {
        title: 'Annual Savings Goal',
        current: Math.max((monthlyIncome - monthlyExpenses) * 12, 0),
        target: monthlyIncome * 12 * 0.2,
        timeframe: '12 months',
        priority: 'high',
      },
    ];
  };

  const analyzeFinancialHealth = () => {
    if (!data) return;

    setIsAnalyzing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const monthlyIncome = data.totalIncome / 12;
      const monthlyExpenses = data.totalExpenses / 12;
      const currentSavings = data.totalIncome - data.totalExpenses;

      const score = calculateHealthScore(monthlyIncome, monthlyExpenses, currentSavings);
      const alerts = generateRiskAlerts(score, monthlyIncome, monthlyExpenses);
      const tips = generateWellnessTips((monthlyIncome - monthlyExpenses) / monthlyIncome * 100, monthlyExpenses);
      const goals = generateFinancialGoals(monthlyIncome, monthlyExpenses, currentSavings);

      setHealthScore(score);
      setRiskAlerts(alerts);
      setWellnessTips(tips);
      setFinancialGoals(goals);
      setIsAnalyzing(false);
    }, 1500);
  };

  useEffect(() => {
    if (data && !loading) {
      analyzeFinancialHealth();
    }
  }, [data, loading]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  if (loading) {
    return (
      <PageLayout title="AI Financial Health Dashboard">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading your financial data...</span>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="AI Financial Health Dashboard">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load financial data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="AI Financial Health Dashboard">
      <div className="space-y-6">
        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Financial Health Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ₹{data?.totalIncome.toLocaleString() || 0}
                </div>
                <div className="text-sm text-muted-foreground">Total Income</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  ₹{data?.totalExpenses.toLocaleString() || 0}
                </div>
                <div className="text-sm text-muted-foreground">Total Expenses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  ₹{((data?.totalIncome || 0) - (data?.totalExpenses || 0)).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Net Savings</div>
              </div>
            </div>
            <Button 
              onClick={analyzeFinancialHealth} 
              disabled={isAnalyzing || !data}
              className="w-full"
            >
              {isAnalyzing ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
              {isAnalyzing ? 'Analyzing...' : 'Refresh Analysis'}
            </Button>
          </CardContent>
        </Card>

        {/* Health Score Display */}
        {healthScore && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="md:col-span-2 lg:col-span-2">
              <CardHeader>
                <CardTitle>Overall Health Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className={`text-6xl font-bold ${getScoreColor(healthScore.overall)}`}>
                    {healthScore.overall}
                  </div>
                  <div className="text-sm text-muted-foreground">out of 100</div>
                  <Progress value={healthScore.overall} className="mt-4" />
                  <Badge variant={getScoreBadgeVariant(healthScore.overall)} className="mt-2">
                    {healthScore.overall >= 80 ? 'Excellent' : healthScore.overall >= 60 ? 'Good' : 'Needs Improvement'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Budget Adherence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getScoreColor(healthScore.breakdown.budgetAdherence)}`}>
                  {healthScore.breakdown.budgetAdherence}
                </div>
                <Progress value={healthScore.breakdown.budgetAdherence} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Savings Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getScoreColor(healthScore.breakdown.savingsRate)}`}>
                  {healthScore.breakdown.savingsRate}
                </div>
                <Progress value={healthScore.breakdown.savingsRate} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Emergency Fund</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getScoreColor(healthScore.breakdown.emergencyFund)}`}>
                  {healthScore.breakdown.emergencyFund}
                </div>
                <Progress value={healthScore.breakdown.emergencyFund} className="mt-2" />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Risk Alerts */}
        {riskAlerts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Risk Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {riskAlerts.map((alert, index) => (
                <Alert key={index} variant={alert.type === 'high' ? 'destructive' : 'default'}>
                  {alert.icon}
                  <AlertDescription>{alert.message}</AlertDescription>
                </Alert>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Wellness Tips */}
        {wellnessTips.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Financial Wellness Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wellnessTips.map((tip, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{tip.category}</h4>
                      <Badge variant={tip.impact === 'high' ? 'default' : 'secondary'}>
                        {tip.impact} impact
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{tip.tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Financial Goals */}
        {financialGoals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Financial Goals Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {financialGoals.map((goal, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{goal.title}</h4>
                      <Badge variant={goal.priority === 'high' ? 'default' : 'secondary'}>
                        {goal.priority} priority
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>₹{goal.current.toLocaleString()}</span>
                        <span>₹{goal.target.toLocaleString()}</span>
                      </div>
                      <Progress value={(goal.current / goal.target) * 100} />
                      <div className="text-xs text-muted-foreground">
                        Target timeframe: {goal.timeframe}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
}
