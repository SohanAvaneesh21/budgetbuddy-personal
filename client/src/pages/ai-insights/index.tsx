import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinancialHealthScore } from "./_components/financial-health-score";
import { SmartBudgetOptimization } from "./_components/smart-budget-optimization";
import { SpendingInsights } from "./_components/spending-insights";
import { InvestmentGuidance } from "./_components/investment-guidance";
import { DebtManagement } from "./_components/debt-management";

export default function AIDashboardPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">AI-Powered Financial Insights</h1>
      
      {/* Financial Health Score - Always visible at the top */}
      <div className="mb-6">
        <FinancialHealthScore />
      </div>

      <Tabs defaultValue="spending" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="spending">Spending Insights</TabsTrigger>
          <TabsTrigger value="budget">Budget Optimization</TabsTrigger>
          <TabsTrigger value="investment">Investment Guidance</TabsTrigger>
          <TabsTrigger value="debt">Debt Management</TabsTrigger>
        </TabsList>

        <TabsContent value="spending" className="mt-4">
          <SpendingInsights />
        </TabsContent>

        <TabsContent value="budget" className="mt-4">
          <SmartBudgetOptimization />
        </TabsContent>

        <TabsContent value="investment" className="mt-4">
          <InvestmentGuidance />
        </TabsContent>

        <TabsContent value="debt" className="mt-4">
          <DebtManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
