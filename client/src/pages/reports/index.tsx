import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageLayout from "@/components/page-layout";
import { useTransactionData } from "@/hooks/useTransactionData";
import { useLazyGenerateReportQuery, useEmailReportMutation } from "@/features/report/reportAPI";
import { 
  FileText, 
  Calendar,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Mail
} from "lucide-react";
import { toast } from "sonner";

export default function Reports() {
  const { data, loading, error } = useTransactionData();
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [customFromDate, setCustomFromDate] = useState<string>("");
  const [customToDate, setCustomToDate] = useState<string>("");
  const [reportType, setReportType] = useState<"monthly" | "custom">("monthly");
  
  const [generateReport, { data: generatedReport, isLoading: isGeneratingReport }] = useLazyGenerateReportQuery();
  const [emailReport, { isLoading: isEmailingReport }] = useEmailReportMutation();

  // Get current date for default values
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  // Generate months and years for dropdowns
  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const handleGenerateReport = async () => {
    if (!data) {
      toast.error("No transaction data available");
      return;
    }

    let fromDate: string;
    let toDate: string;

    if (reportType === "monthly") {
      if (!selectedMonth || !selectedYear) {
        toast.error("Please select month and year");
        return;
      }
      
      const month = parseInt(selectedMonth);
      const year = parseInt(selectedYear);
      fromDate = new Date(year, month - 1, 1).toISOString();
      toDate = new Date(year, month, 0).toISOString();
    } else {
      if (!customFromDate || !customToDate) {
        toast.error("Please select from and to dates");
        return;
      }
      fromDate = new Date(customFromDate).toISOString();
      toDate = new Date(customToDate).toISOString();
    }

    try {
      await generateReport({ from: fromDate, to: toDate });
      toast.success("Report generated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate report");
    }
  };

  const sendReportByEmail = async () => {
    if (!generatedReport) {
      toast.error("Please generate a report first");
      return;
    }
    
    try {
      let fromDate: string;
      let toDate: string;

      if (reportType === "monthly") {
        if (!selectedMonth || !selectedYear) {
          toast.error("Please select month and year");
          return;
        }
        
        const month = parseInt(selectedMonth);
        const year = parseInt(selectedYear);
        fromDate = new Date(year, month - 1, 1).toISOString();
        toDate = new Date(year, month, 0).toISOString();
      } else {
        if (!customFromDate || !customToDate) {
          toast.error("Please select from and to dates");
          return;
        }
        fromDate = new Date(customFromDate).toISOString();
        toDate = new Date(customToDate).toISOString();
      }

      await emailReport({ from: fromDate, to: toDate }).unwrap();
      toast.success("Report has been sent to your email address!");
      
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error("Failed to send email. Please try again.");
    }
  };



  return (
    <PageLayout
      title="Financial Reports"
      subtitle="Generate detailed financial reports with AI insights and export options"
      addMarginTop
      rightAction={null}
    >
      {/* Report Generation Section */}
      <Card className="border shadow-none mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Generate Custom Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Report Type Selection */}
            <div className="flex gap-4">
              <Button
                variant={reportType === "monthly" ? "default" : "outline"}
                onClick={() => setReportType("monthly")}
                className="flex-1"
              >
                Monthly Report
              </Button>
              <Button
                variant={reportType === "custom" ? "default" : "outline"}
                onClick={() => setReportType("custom")}
                className="flex-1"
              >
                Custom Date Range
              </Button>
            </div>

            {/* Monthly Report Options */}
            {reportType === "monthly" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="month">Month</Label>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Custom Date Range Options */}
            {reportType === "custom" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromDate">From Date</Label>
                  <Input
                    id="fromDate"
                    type="date"
                    value={customFromDate}
                    onChange={(e) => setCustomFromDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="toDate">To Date</Label>
                  <Input
                    id="toDate"
                    type="date"
                    value={customToDate}
                    onChange={(e) => setCustomToDate(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Generate Report Button */}
            <div className="flex gap-2">
              <Button 
                onClick={handleGenerateReport} 
                disabled={isGeneratingReport || !data}
                className="flex-1"
              >
                {isGeneratingReport ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <TrendingUp className="h-4 w-4 mr-2" />
                )}
                Generate Report
              </Button>
              {generatedReport && (
                <Button 
                  onClick={sendReportByEmail} 
                  variant="outline"
                  disabled={isEmailingReport}
                >
                  {isEmailingReport ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Mail className="h-4 w-4 mr-2" />
                  )}
                  {isEmailingReport ? "Sending..." : "Email Report"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Report Display */}
      {generatedReport && (
        <Card className="border shadow-none mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generated Report - {generatedReport.period}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Financial Summary */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Financial Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">Total Income</p>
                    <p className="text-2xl font-bold text-green-700">
                      ₹{generatedReport.summary.income.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm text-red-600 font-medium">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-700">
                      ₹{generatedReport.summary.expenses.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">Net Balance</p>
                    <p className="text-2xl font-bold text-blue-700">
                      ₹{generatedReport.summary.balance.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-600 font-medium">Savings Rate</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {generatedReport.summary.savingsRate}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Top Categories */}
              {generatedReport.summary.topCategories.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-4">Top Expense Categories</h3>
                  <div className="space-y-2">
                    {generatedReport.summary.topCategories.map((category, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{category.name}</span>
                        <div className="text-right">
                          <span className="font-bold">₹{category.amount.toLocaleString()}</span>
                          <span className="text-sm text-gray-600 ml-2">({category.percent}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Insights */}
              {generatedReport.insights.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-4">AI Insights</h3>
                  <div className="space-y-2">
                    {generatedReport.insights.map((insight, index) => (
                      <div key={index} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <p className="text-sm">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading and Error States */}
      {loading && (
        <Card className="border shadow-none mb-6">
          <CardContent className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            Loading financial data...
          </CardContent>
        </Card>
      )}
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load financial data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      )}

    </PageLayout>
  );
}
