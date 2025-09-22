import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown,
  AlertTriangle, 
  Eye,
  Calendar,
  BarChart3,
  RefreshCw,
  Zap,
  Target
} from "lucide-react";
import PageLayout from "@/components/page-layout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface SpendingPrediction {
  month: string;
  predicted: number;
  actual?: number;
  confidence: number;
}

interface TrendAnalysis {
  category: string;
  trend: "increasing" | "decreasing" | "stable";
  changePercentage: number;
  insight: string;
  impact: "high" | "medium" | "low";
}

interface Anomaly {
  id: string;
  date: string;
  category: string;
  amount: number;
  expectedAmount: number;
  severity: "high" | "medium" | "low";
  description: string;
}

interface CategoryInsight {
  category: string;
  currentSpend: number;
  avgSpend: number;
  trend: "up" | "down" | "stable";
  explanation: string;
  recommendation: string;
}

export default function AISpendingInsightsPage() {
  const [spendingPredictions, setSpendingPredictions] = useState<SpendingPrediction[]>([
    { month: "Jan", predicted: 45000, actual: 47000, confidence: 85 },
    { month: "Feb", predicted: 42000, actual: 44000, confidence: 88 },
    { month: "Mar", predicted: 48000, actual: 46000, confidence: 82 },
    { month: "Apr", predicted: 51000, confidence: 79 },
    { month: "May", predicted: 49000, confidence: 83 },
    { month: "Jun", predicted: 53000, confidence: 76 }
  ]);

  const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysis[]>([
    {
      category: "Food & Dining",
      trend: "increasing",
      changePercentage: 23,
      insight: "Dining out frequency has increased significantly in the last 3 months",
      impact: "high"
    },
    {
      category: "Transportation",
      trend: "decreasing",
      changePercentage: -15,
      insight: "Fuel costs reduced due to work-from-home arrangements",
      impact: "medium"
    },
    {
      category: "Entertainment",
      trend: "increasing",
      changePercentage: 18,
      insight: "Subscription services and streaming platforms added recently",
      impact: "medium"
    },
    {
      category: "Healthcare",
      trend: "stable",
      changePercentage: 2,
      insight: "Consistent monthly healthcare expenses as expected",
      impact: "low"
    }
  ]);

  const [anomalies, setAnomalies] = useState<Anomaly[]>([
    {
      id: "1",
      date: "2025-01-15",
      category: "Shopping",
      amount: 15000,
      expectedAmount: 5000,
      severity: "high",
      description: "Unusual large purchase - Electronics shopping spree"
    },
    {
      id: "2",
      date: "2025-01-08",
      category: "Food & Dining",
      amount: 3500,
      expectedAmount: 1200,
      severity: "medium",
      description: "Higher than usual dining expenses - Special occasion"
    },
    {
      id: "3",
      date: "2025-01-03",
      category: "Transportation",
      amount: 8000,
      expectedAmount: 2500,
      severity: "medium",
      description: "Unexpected travel expenses - Emergency trip"
    }
  ]);

  const [categoryInsights, setCategoryInsights] = useState<CategoryInsight[]>([
    {
      category: "Groceries",
      currentSpend: 8500,
      avgSpend: 7200,
      trend: "up",
      explanation: "18% increase due to bulk buying and premium product choices",
      recommendation: "Consider switching to store brands for 15% savings"
    },
    {
      category: "Utilities",
      currentSpend: 3200,
      avgSpend: 3800,
      trend: "down",
      explanation: "16% decrease from energy-efficient appliances and conservation",
      recommendation: "Great job! Continue current energy-saving practices"
    },
    {
      category: "Subscriptions",
      currentSpend: 2800,
      avgSpend: 1900,
      trend: "up",
      explanation: "47% increase from new streaming and software subscriptions",
      recommendation: "Review and cancel unused subscriptions to save ₹900/month"
    }
  ]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
      case "up":
        return <TrendingUp className="h-4 w-4 text-red-600" />;
      case "decreasing":
      case "down":
        return <TrendingDown className="h-4 w-4 text-green-600" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-400" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "increasing":
      case "up":
        return "text-red-600";
      case "decreasing":
      case "down":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "text-red-600 bg-red-50 border-red-200";
      case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low": return "text-blue-600 bg-blue-50 border-blue-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const refreshAnalysis = async () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <PageLayout
      className="space-y-6"
      renderPageHeader={
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Predictive Spending Insights</h1>
            <p className="text-gray-600 mt-1">AI-powered spending analysis and future predictions</p>
          </div>
          <Button onClick={refreshAnalysis} disabled={isAnalyzing} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            Refresh Analysis
          </Button>
        </div>
      }
    >
      {/* Future Expense Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Future Expense Predictions
          </CardTitle>
          <p className="text-sm text-gray-600">AI forecasts your spending for the next 6 months</p>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={spendingPredictions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    `₹${value.toLocaleString()}`, 
                    name === 'predicted' ? 'Predicted' : 'Actual'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="actual"
                />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="predicted"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {spendingPredictions.slice(-3).map((prediction, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{prediction.month}</span>
                  <Badge variant="outline">{prediction.confidence}% confidence</Badge>
                </div>
                <div className="text-lg font-bold text-blue-600">
                  ₹{prediction.predicted.toLocaleString()}
                </div>
                <Progress value={prediction.confidence} className="h-1 mt-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Spending Trend Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Spending Trend Analysis
          </CardTitle>
          <p className="text-sm text-gray-600">Pattern recognition and trend alerts</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trendAnalysis.map((trend, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{trend.category}</h3>
                    {getTrendIcon(trend.trend)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getImpactBadge(trend.impact)}>
                      {trend.impact.toUpperCase()} IMPACT
                    </Badge>
                    <span className={`font-bold ${getTrendColor(trend.trend)}`}>
                      {trend.changePercentage > 0 ? '+' : ''}{trend.changePercentage}%
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{trend.insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Deep Dive */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-green-600" />
            Category Deep Dive
          </CardTitle>
          <p className="text-sm text-gray-600">AI explains why certain categories are trending</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryInsights.map((insight, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold">{insight.category}</h3>
                  {getTrendIcon(insight.trend)}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <span className="text-xs text-gray-500">Current Month</span>
                    <div className="text-lg font-semibold">₹{insight.currentSpend.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">3-Month Average</span>
                    <div className="text-lg font-semibold text-gray-600">₹{insight.avgSpend.toLocaleString()}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">Why this is happening</span>
                    </div>
                    <p className="text-sm text-blue-700">{insight.explanation}</p>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">AI Recommendation</span>
                    </div>
                    <p className="text-sm text-green-700">{insight.recommendation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Anomaly Detection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Anomaly Detection
          </CardTitle>
          <p className="text-sm text-gray-600">Unusual spending pattern alerts</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {anomalies.map((anomaly) => (
              <div key={anomaly.id} className={`border rounded-lg p-4 ${getSeverityColor(anomaly.severity)}`}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-semibold">{anomaly.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={anomaly.severity === "high" ? "destructive" : anomaly.severity === "medium" ? "secondary" : "outline"}>
                      {anomaly.severity.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-gray-500">{new Date(anomaly.date).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div>
                    <span className="text-xs">Actual Amount</span>
                    <div className="font-bold text-red-600">₹{anomaly.amount.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-xs">Expected Amount</span>
                    <div className="font-bold text-gray-600">₹{anomaly.expectedAmount.toLocaleString()}</div>
                  </div>
                </div>
                
                <p className="text-sm">{anomaly.description}</p>
                <div className="mt-2 text-xs">
                  <span className="font-medium">Variance: </span>
                  <span className="text-red-600">
                    +₹{(anomaly.amount - anomaly.expectedAmount).toLocaleString()} 
                    ({(((anomaly.amount - anomaly.expectedAmount) / anomaly.expectedAmount) * 100).toFixed(0)}% above normal)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights Summary */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Calendar className="h-5 w-5" />
            Monthly Insights Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">₹51,000</div>
              <p className="text-sm text-gray-600">Predicted Next Month</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">3</div>
              <p className="text-sm text-gray-600">High-Impact Trends</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">₹12,500</div>
              <p className="text-sm text-gray-600">Potential Monthly Savings</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
