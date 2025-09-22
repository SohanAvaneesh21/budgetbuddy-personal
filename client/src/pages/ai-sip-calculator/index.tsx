import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Calculator,
  PieChart,
  BarChart3,
  IndianRupee,
  Target,
  RefreshCw,
  Lightbulb
} from "lucide-react";
import PageLayout from "@/components/page-layout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';

interface SIPCalculation {
  monthlyInvestment: number;
  expectedReturn: number;
  timePeriod: number;
  totalInvestment: number;
  expectedReturns: number;
  maturityAmount: number;
}

interface EquityAllocation {
  category: string;
  percentage: number;
  amount: number;
  expectedReturn: number;
  color: string;
}

interface ProjectionData {
  year: number;
  invested: number;
  returns: number;
  total: number;
}

export default function AISIPCalculatorPage() {
  const [sipCalculation, setSipCalculation] = useState<SIPCalculation>({
    monthlyInvestment: 10000,
    expectedReturn: 12,
    timePeriod: 10,
    totalInvestment: 0,
    expectedReturns: 0,
    maturityAmount: 0
  });

  const [equityAllocations, setEquityAllocations] = useState<EquityAllocation[]>([
    { category: "Large Cap Equity", percentage: 40, amount: 4000, expectedReturn: 11, color: "#3b82f6" },
    { category: "Mid Cap Equity", percentage: 25, amount: 2500, expectedReturn: 14, color: "#10b981" },
    { category: "Small Cap Equity", percentage: 15, amount: 1500, expectedReturn: 16, color: "#f59e0b" },
    { category: "International Equity", percentage: 10, amount: 1000, expectedReturn: 10, color: "#8b5cf6" },
    { category: "Debt Funds", percentage: 10, amount: 1000, expectedReturn: 7, color: "#ef4444" }
  ]);

  const [projectionData, setProjectionData] = useState<ProjectionData[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateSIP = () => {
    const { monthlyInvestment, expectedReturn, timePeriod } = sipCalculation;
    const monthlyRate = expectedReturn / 100 / 12;
    const totalMonths = timePeriod * 12;
    
    // SIP Maturity Amount Formula: M = P × [{(1 + i)^n - 1} / i] × (1 + i)
    const maturityAmount = monthlyInvestment * 
      (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate));
    
    const totalInvestment = monthlyInvestment * totalMonths;
    const expectedReturns = maturityAmount - totalInvestment;

    setSipCalculation({
      ...sipCalculation,
      totalInvestment,
      expectedReturns,
      maturityAmount
    });

    // Generate year-wise projection data
    const projections: ProjectionData[] = [];
    for (let year = 1; year <= timePeriod; year++) {
      const months = year * 12;
      const yearlyMaturity = monthlyInvestment * 
        (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
      const yearlyInvestment = monthlyInvestment * months;
      const yearlyReturns = yearlyMaturity - yearlyInvestment;
      
      projections.push({
        year,
        invested: yearlyInvestment,
        returns: yearlyReturns,
        total: yearlyMaturity
      });
    }
    setProjectionData(projections);
  };

  const updateEquityAllocation = (index: number, percentage: number) => {
    const newAllocations = [...equityAllocations];
    newAllocations[index].percentage = percentage;
    newAllocations[index].amount = (sipCalculation.monthlyInvestment * percentage) / 100;
    
    // Ensure total doesn't exceed 100%
    const totalPercentage = newAllocations.reduce((sum, allocation) => sum + allocation.percentage, 0);
    if (totalPercentage <= 100) {
      setEquityAllocations(newAllocations);
    }
  };

  const calculateWeightedReturn = () => {
    const totalPercentage = equityAllocations.reduce((sum, allocation) => sum + allocation.percentage, 0);
    if (totalPercentage === 0) return 0;
    
    const weightedReturn = equityAllocations.reduce((sum, allocation) => 
      sum + (allocation.percentage * allocation.expectedReturn), 0) / totalPercentage;
    
    return weightedReturn;
  };

  const refreshCalculations = async () => {
    setIsCalculating(true);
    calculateSIP();
    setTimeout(() => {
      setIsCalculating(false);
    }, 2000);
  };

  useEffect(() => {
    calculateSIP();
  }, [sipCalculation.monthlyInvestment, sipCalculation.expectedReturn, sipCalculation.timePeriod]);

  useEffect(() => {
    // Update expected return based on equity allocation
    const weightedReturn = calculateWeightedReturn();
    if (weightedReturn > 0) {
      setSipCalculation(prev => ({ ...prev, expectedReturn: Math.round(weightedReturn * 100) / 100 }));
    }
  }, [equityAllocations]);

  const totalAllocationPercentage = equityAllocations.reduce((sum, allocation) => sum + allocation.percentage, 0);

  return (
    <PageLayout
      className="space-y-6"
      renderPageHeader={
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">SIP Calculator & Portfolio Optimizer</h1>
            <p className="text-gray-600 mt-1">Calculate SIP returns with smart equity allocation strategies</p>
          </div>
          <Button onClick={refreshCalculations} disabled={isCalculating} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${isCalculating ? 'animate-spin' : ''}`} />
            Recalculate
          </Button>
        </div>
      }
    >
      {/* SIP Input Parameters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-600" />
            SIP Investment Parameters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="monthly-investment">Monthly Investment (₹)</Label>
              <Input
                id="monthly-investment"
                type="number"
                value={sipCalculation.monthlyInvestment}
                onChange={(e) => setSipCalculation({...sipCalculation, monthlyInvestment: Number(e.target.value)})}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="expected-return">Expected Annual Return (%)</Label>
              <Input
                id="expected-return"
                type="number"
                step="0.1"
                value={sipCalculation.expectedReturn}
                onChange={(e) => setSipCalculation({...sipCalculation, expectedReturn: Number(e.target.value)})}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="time-period">Investment Period (Years)</Label>
              <Input
                id="time-period"
                type="number"
                value={sipCalculation.timePeriod}
                onChange={(e) => setSipCalculation({...sipCalculation, timePeriod: Number(e.target.value)})}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SIP Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">₹{sipCalculation.totalInvestment.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              ₹{sipCalculation.monthlyInvestment.toLocaleString()}/month × {sipCalculation.timePeriod * 12} months
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Expected Returns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">₹{sipCalculation.expectedReturns.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {((sipCalculation.expectedReturns / sipCalculation.totalInvestment) * 100).toFixed(1)}% total return
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Maturity Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              <span className="text-2xl font-bold text-purple-600">₹{sipCalculation.maturityAmount.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              After {sipCalculation.timePeriod} years @ {sipCalculation.expectedReturn}% p.a.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Equity Allocation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-green-600" />
            Smart Equity Allocation Strategy
          </CardTitle>
          <p className="text-sm text-gray-600">Optimize your portfolio allocation across different equity categories</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Allocation Controls */}
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Portfolio Allocation</h3>
                <Badge variant={totalAllocationPercentage === 100 ? "default" : "secondary"}>
                  {totalAllocationPercentage}% Allocated
                </Badge>
              </div>
              
              {equityAllocations.map((allocation, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{allocation.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{allocation.expectedReturn}% return</span>
                      <Badge variant="outline">{allocation.percentage}%</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={allocation.percentage}
                      onChange={(e) => updateEquityAllocation(index, Number(e.target.value))}
                      className="w-20"
                    />
                    <div className="flex-1">
                      <Progress value={allocation.percentage} className="h-2" />
                    </div>
                    <span className="text-sm font-medium w-20">
                      ₹{allocation.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Weighted Expected Return</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {calculateWeightedReturn().toFixed(2)}% p.a.
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  Based on your current allocation strategy
                </p>
              </div>
            </div>

            {/* Allocation Visualization */}
            <div className="space-y-4">
              <h3 className="font-semibold">Allocation Breakdown</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Tooltip formatter={(value) => [`${value}%`, 'Allocation']} />
                    <RechartsPieChart data={equityAllocations.filter(a => a.percentage > 0)}>
                      {equityAllocations.filter(a => a.percentage > 0).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </RechartsPieChart>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-2">
                {equityAllocations.filter(a => a.percentage > 0).map((allocation, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: allocation.color }}
                      />
                      <span className="text-sm">{allocation.category}</span>
                    </div>
                    <span className="text-sm font-medium">{allocation.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Growth Projection Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            SIP Growth Projection
          </CardTitle>
          <p className="text-sm text-gray-600">Year-wise breakdown of your investment growth</p>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} />
                <Tooltip 
                  formatter={(value, name) => [
                    `₹${Number(value).toLocaleString()}`, 
                    name === 'invested' ? 'Total Invested' : 
                    name === 'returns' ? 'Returns Generated' : 'Total Value'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="invested" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="invested"
                />
                <Line 
                  type="monotone" 
                  dataKey="returns" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="returns"
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  name="total"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Investment Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-orange-600" />
            Investment Scenarios Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { scenario: "Conservative", return: 8, risk: "Low" },
              { scenario: "Moderate", return: 12, risk: "Medium" },
              { scenario: "Aggressive", return: 15, risk: "High" }
            ].map((scenario, index) => {
              const monthlyRate = scenario.return / 100 / 12;
              const totalMonths = sipCalculation.timePeriod * 12;
              const maturityAmount = sipCalculation.monthlyInvestment * 
                (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate));
              const returns = maturityAmount - sipCalculation.totalInvestment;
              
              return (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{scenario.scenario}</h3>
                    <Badge variant={
                      scenario.risk === "Low" ? "outline" : 
                      scenario.risk === "Medium" ? "secondary" : "destructive"
                    }>
                      {scenario.risk} Risk
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Expected Return</span>
                      <span className="font-medium">{scenario.return}% p.a.</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Maturity Amount</span>
                      <span className="font-medium text-green-600">₹{maturityAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Returns</span>
                      <span className="font-medium text-blue-600">₹{returns.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* SIP Profit vs Investment Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-green-600" />
            Investment vs Profit Breakdown
          </CardTitle>
          <p className="text-sm text-gray-600">Visual breakdown of your total investment and expected profits</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pie Chart */}
            <div className="space-y-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Tooltip 
                      formatter={(value, name) => [
                        `₹${Number(value).toLocaleString()}`, 
                        name === 'investment' ? 'Total Investment' : 'Expected Profit'
                      ]} 
                    />
                    <Pie 
                      data={[
                        { name: 'investment', value: sipCalculation.totalInvestment },
                        { name: 'profit', value: sipCalculation.expectedReturns }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      <Cell fill="#3b82f6" />
                      <Cell fill="#10b981" />
                    </Pie>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-sm">Total Investment</span>
                  </div>
                  <span className="text-sm font-medium">₹{sipCalculation.totalInvestment.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm">Expected Profit</span>
                  </div>
                  <span className="text-sm font-medium">₹{sipCalculation.expectedReturns.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="space-y-4">
              <h3 className="font-semibold">Investment Summary</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <IndianRupee className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Your Investment</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    ₹{sipCalculation.totalInvestment.toLocaleString()}
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    {((sipCalculation.totalInvestment / sipCalculation.maturityAmount) * 100).toFixed(1)}% of maturity amount
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">Expected Profit</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    ₹{sipCalculation.expectedReturns.toLocaleString()}
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    {((sipCalculation.expectedReturns / sipCalculation.maturityAmount) * 100).toFixed(1)}% of maturity amount
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-purple-800">Profit Multiplier</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {(sipCalculation.expectedReturns / sipCalculation.totalInvestment).toFixed(2)}x
                  </div>
                  <p className="text-sm text-purple-700 mt-1">
                    Your money will grow {(sipCalculation.expectedReturns / sipCalculation.totalInvestment).toFixed(1)} times
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
