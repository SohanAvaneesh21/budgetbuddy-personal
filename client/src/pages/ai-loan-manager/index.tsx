import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Calculator,
  PlusCircle,
  Edit,
  Trash2,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from "lucide-react";
import PageLayout from "@/components/page-layout";

interface Loan {
  id: string;
  name: string;
  principal: number;
  currentBalance: number;
  interestRate: number;
  tenure: number;
  monthlyEMI: number;
  remainingMonths: number;
  totalInterest: number;
  type: "home" | "personal" | "car" | "education" | "credit_card";
}

interface LoanSummary {
  totalLoans: number;
  totalOutstanding: number;
  totalMonthlyEMI: number;
  totalInterestPaid: number;
  debtToIncomeRatio: number;
}

export default function AILoanManagerPage() {
  const [loans, setLoans] = useState<Loan[]>([
    {
      id: "1",
      name: "Home Loan",
      principal: 2500000,
      currentBalance: 1850000,
      interestRate: 8.5,
      tenure: 240,
      monthlyEMI: 25000,
      remainingMonths: 178,
      totalInterest: 850000,
      type: "home"
    },
    {
      id: "2",
      name: "Car Loan",
      principal: 800000,
      currentBalance: 320000,
      interestRate: 9.2,
      tenure: 84,
      monthlyEMI: 12500,
      remainingMonths: 28,
      totalInterest: 125000,
      type: "car"
    },
    {
      id: "3",
      name: "Personal Loan",
      principal: 300000,
      currentBalance: 180000,
      interestRate: 14.5,
      tenure: 36,
      monthlyEMI: 10200,
      remainingMonths: 18,
      totalInterest: 67200,
      type: "personal"
    }
  ]);

  const [monthlyIncome, setMonthlyIncome] = useState<number>(75000);
  const [showAddLoan, setShowAddLoan] = useState(false);
  const [editingLoan, setEditingLoan] = useState<string | null>(null);
  const [newLoan, setNewLoan] = useState({
    name: "",
    principal: 0,
    interestRate: 0,
    tenure: 0,
    type: "personal" as const
  });
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateEMI = (principal: number, rate: number, tenure: number) => {
    const monthlyRate = rate / 100 / 12;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                (Math.pow(1 + monthlyRate, tenure) - 1);
    return Math.round(emi);
  };

  const calculateLoanSummary = (): LoanSummary => {
    const totalOutstanding = loans.reduce((sum, loan) => sum + loan.currentBalance, 0);
    const totalMonthlyEMI = loans.reduce((sum, loan) => sum + loan.monthlyEMI, 0);
    const totalInterestPaid = loans.reduce((sum, loan) => sum + (loan.principal - loan.currentBalance), 0);
    const debtToIncomeRatio = (totalMonthlyEMI / monthlyIncome) * 100;

    return {
      totalLoans: loans.length,
      totalOutstanding,
      totalMonthlyEMI,
      totalInterestPaid,
      debtToIncomeRatio
    };
  };

  const addLoan = () => {
    if (!newLoan.name || !newLoan.principal || !newLoan.interestRate || !newLoan.tenure) return;

    const emi = calculateEMI(newLoan.principal, newLoan.interestRate, newLoan.tenure);
    const totalInterest = (emi * newLoan.tenure) - newLoan.principal;

    const loan: Loan = {
      id: Date.now().toString(),
      name: newLoan.name,
      principal: newLoan.principal,
      currentBalance: newLoan.principal,
      interestRate: newLoan.interestRate,
      tenure: newLoan.tenure,
      monthlyEMI: emi,
      remainingMonths: newLoan.tenure,
      totalInterest,
      type: newLoan.type
    };

    setLoans([...loans, loan]);
    setNewLoan({ name: "", principal: 0, interestRate: 0, tenure: 0, type: "personal" });
    setShowAddLoan(false);
  };

  const deleteLoan = (id: string) => {
    setLoans(loans.filter(loan => loan.id !== id));
  };

  const updateLoan = (id: string, field: string, value: string | number) => {
    setLoans(loans.map(loan => {
      if (loan.id === id) {
        const updatedLoan = { ...loan, [field]: value };
        
        // Recalculate EMI and other values if principal, rate, or tenure changes
        if (field === 'principal' || field === 'interestRate' || field === 'tenure') {
          const emi = calculateEMI(
            field === 'principal' ? Number(value) : updatedLoan.principal,
            field === 'interestRate' ? Number(value) : updatedLoan.interestRate,
            field === 'tenure' ? Number(value) : updatedLoan.tenure
          );
          const totalInterest = (emi * updatedLoan.tenure) - updatedLoan.principal;
          
          return {
            ...updatedLoan,
            monthlyEMI: emi,
            totalInterest,
            remainingMonths: updatedLoan.tenure // Reset remaining months
          };
        }
        
        return updatedLoan;
      }
      return loan;
    }));
  };

  const getLoanTypeColor = (type: string) => {
    switch (type) {
      case "home": return "bg-green-100 text-green-800";
      case "car": return "bg-blue-100 text-blue-800";
      case "personal": return "bg-purple-100 text-purple-800";
      case "education": return "bg-yellow-100 text-yellow-800";
      case "credit_card": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDebtRatioStatus = (ratio: number) => {
    if (ratio <= 30) return { status: "good", color: "text-green-600", message: "Healthy debt ratio" };
    if (ratio <= 40) return { status: "moderate", color: "text-yellow-600", message: "Moderate debt burden" };
    return { status: "high", color: "text-red-600", message: "High debt burden - consider consolidation" };
  };

  const summary = calculateLoanSummary();
  const debtStatus = getDebtRatioStatus(summary.debtToIncomeRatio);

  const refreshCalculations = async () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
    }, 2000);
  };

  return (
    <PageLayout
      className="space-y-6"
      renderPageHeader={
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Loan Management Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your loans and optimize your debt strategy</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={refreshCalculations} disabled={isCalculating} variant="outline" className="gap-2">
              <RefreshCw className={`h-4 w-4 ${isCalculating ? 'animate-spin' : ''}`} />
              Recalculate
            </Button>
            <Button onClick={() => setShowAddLoan(true)} className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Loan
            </Button>
          </div>
        </div>
      }
    >
      {/* Loan Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-red-600" />
              <span className="text-2xl font-bold text-red-600">₹{summary.totalOutstanding.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Monthly EMI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">₹{summary.totalMonthlyEMI.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Debt-to-Income Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {debtStatus.status === "good" ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              )}
              <span className={`text-2xl font-bold ${debtStatus.color}`}>
                {summary.debtToIncomeRatio.toFixed(1)}%
              </span>
            </div>
            <p className={`text-xs mt-1 ${debtStatus.color}`}>{debtStatus.message}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Interest Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-purple-600" />
              <span className="text-2xl font-bold text-purple-600">₹{summary.totalInterestPaid.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Circular Debt Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Debt Distribution & Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Debt Distribution */}
            <div className="space-y-4">
              <h3 className="font-semibold">Loan Distribution</h3>
              {loans.map((loan) => {
                const progressPercentage = ((loan.principal - loan.currentBalance) / loan.principal) * 100;
                return (
                  <div key={loan.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{loan.name}</span>
                      <Badge className={getLoanTypeColor(loan.type)}>
                        {loan.type.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₹{loan.currentBalance.toLocaleString()} remaining</span>
                      <span>{progressPercentage.toFixed(1)}% paid</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                );
              })}
            </div>

            {/* Monthly Income vs EMI */}
            <div className="space-y-4">
              <h3 className="font-semibold">Income vs EMI Analysis</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="monthly-income">Monthly Income</Label>
                  <Input
                    id="monthly-income"
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span>Available Income</span>
                    <span className="font-semibold">₹{monthlyIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Total EMI</span>
                    <span className="font-semibold text-red-600">₹{summary.totalMonthlyEMI.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Remaining Income</span>
                    <span className="font-semibold text-green-600">
                      ₹{(monthlyIncome - summary.totalMonthlyEMI).toLocaleString()}
                    </span>
                  </div>
                  <Progress value={summary.debtToIncomeRatio} className="h-3 mt-2" />
                  <p className="text-xs text-gray-500 mt-1">
                    {summary.debtToIncomeRatio.toFixed(1)}% of income goes to EMI
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loan Details */}
      <Card>
        <CardHeader>
          <CardTitle>Loan Details & Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loans.map((loan) => (
              <div key={loan.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    {editingLoan === loan.id ? (
                      <Input
                        value={loan.name}
                        onChange={(e) => updateLoan(loan.id, 'name', e.target.value)}
                        onBlur={() => setEditingLoan(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingLoan(null)}
                        className="font-semibold text-lg"
                        autoFocus
                      />
                    ) : (
                      <h3 
                        className="font-semibold text-lg cursor-pointer hover:text-blue-600"
                        onClick={() => setEditingLoan(loan.id)}
                      >
                        {loan.name}
                      </h3>
                    )}
                    <Badge className={getLoanTypeColor(loan.type)}>
                      {loan.type.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditingLoan(editingLoan === loan.id ? null : loan.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => deleteLoan(loan.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div>
                    <span className="text-xs text-gray-500">Principal</span>
                    {editingLoan === loan.id ? (
                      <Input
                        type="number"
                        value={loan.principal}
                        onChange={(e) => updateLoan(loan.id, 'principal', Number(e.target.value))}
                        className="font-semibold text-sm h-8"
                      />
                    ) : (
                      <div className="font-semibold">₹{loan.principal.toLocaleString()}</div>
                    )}
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Outstanding</span>
                    <div className="font-semibold text-red-600">₹{loan.currentBalance.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Interest Rate</span>
                    {editingLoan === loan.id ? (
                      <Input
                        type="number"
                        step="0.1"
                        value={loan.interestRate}
                        onChange={(e) => updateLoan(loan.id, 'interestRate', Number(e.target.value))}
                        className="font-semibold text-sm h-8"
                      />
                    ) : (
                      <div className="font-semibold">{loan.interestRate}%</div>
                    )}
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Monthly EMI</span>
                    <div className="font-semibold text-blue-600">₹{loan.monthlyEMI.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Remaining Months</span>
                    {editingLoan === loan.id ? (
                      <Input
                        type="number"
                        value={loan.tenure}
                        onChange={(e) => updateLoan(loan.id, 'tenure', Number(e.target.value))}
                        className="font-semibold text-sm h-8"
                      />
                    ) : (
                      <div className="font-semibold">{loan.remainingMonths}</div>
                    )}
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Total Interest</span>
                    <div className="font-semibold text-purple-600">₹{loan.totalInterest.toLocaleString()}</div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Loan Progress</span>
                    <span>{(((loan.principal - loan.currentBalance) / loan.principal) * 100).toFixed(1)}% Complete</span>
                  </div>
                  <Progress value={((loan.principal - loan.currentBalance) / loan.principal) * 100} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add New Loan Modal */}
      {showAddLoan && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Add New Loan</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="loan-name">Loan Name</Label>
                <Input
                  id="loan-name"
                  value={newLoan.name}
                  onChange={(e) => setNewLoan({...newLoan, name: e.target.value})}
                  placeholder="e.g., Personal Loan"
                />
              </div>
              
              <div>
                <Label htmlFor="loan-principal">Principal Amount (₹)</Label>
                <Input
                  id="loan-principal"
                  type="number"
                  value={newLoan.principal || ""}
                  onChange={(e) => setNewLoan({...newLoan, principal: Number(e.target.value)})}
                  placeholder="500000"
                />
              </div>
              
              <div>
                <Label htmlFor="loan-rate">Interest Rate (%)</Label>
                <Input
                  id="loan-rate"
                  type="number"
                  step="0.1"
                  value={newLoan.interestRate || ""}
                  onChange={(e) => setNewLoan({...newLoan, interestRate: Number(e.target.value)})}
                  placeholder="12.5"
                />
              </div>
              
              <div>
                <Label htmlFor="loan-tenure">Tenure (Months)</Label>
                <Input
                  id="loan-tenure"
                  type="number"
                  value={newLoan.tenure || ""}
                  onChange={(e) => setNewLoan({...newLoan, tenure: Number(e.target.value)})}
                  placeholder="36"
                />
              </div>
              
              <div>
                <Label htmlFor="loan-type">Loan Type</Label>
                <select
                  id="loan-type"
                  value={newLoan.type}
                  onChange={(e) => setNewLoan({...newLoan, type: e.target.value as any})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="personal">Personal Loan</option>
                  <option value="home">Home Loan</option>
                  <option value="car">Car Loan</option>
                  <option value="education">Education Loan</option>
                  <option value="credit_card">Credit Card</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button onClick={addLoan} className="flex-1">Add Loan</Button>
              <Button variant="outline" onClick={() => setShowAddLoan(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* AI Recommendations */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <AlertCircle className="h-5 w-5" />
            AI Loan Optimization Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-white/70 rounded-lg">
              <h4 className="font-semibold text-blue-800">Priority: Pay off Personal Loan first</h4>
              <p className="text-sm text-blue-700">
                Your personal loan has the highest interest rate (14.5%). Paying an extra ₹5,000/month 
                can save you ₹23,400 in interest and clear it 8 months earlier.
              </p>
            </div>
            
            <div className="p-3 bg-white/70 rounded-lg">
              <h4 className="font-semibold text-blue-800">Debt Consolidation Opportunity</h4>
              <p className="text-sm text-blue-700">
                Consider consolidating your personal and car loans into a single loan at 11% interest. 
                This could reduce your monthly EMI by ₹3,200.
              </p>
            </div>
            
            <div className="p-3 bg-white/70 rounded-lg">
              <h4 className="font-semibold text-blue-800">Emergency Fund Alert</h4>
              <p className="text-sm text-blue-700">
                Your debt-to-income ratio is {summary.debtToIncomeRatio.toFixed(1)}%. 
                Ensure you have 6 months of EMI (₹{(summary.totalMonthlyEMI * 6).toLocaleString()}) 
                as emergency fund before prepaying loans.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
