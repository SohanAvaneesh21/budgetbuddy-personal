import DashboardDataChart from "./dashboard-data-chart";
import DashboardSummary from "./dashboard-summary";
import PageLayout from "@/components/page-layout";
import ExpensePieChart from "./expense-pie-chart";
import DashboardRecentTransactions from "./dashboard-recent-transactions";
import { useState } from "react";
import { DateRangeType } from "@/components/date-range-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { 
  PiggyBank, 
  CreditCard, 
  Calculator,
  ArrowRight
} from "lucide-react";

const Dashboard = () => {
  const [dateRange, _setDateRange] = useState<DateRangeType>(null);
  const navigate = useNavigate();

  const aiFeatures = [
    {
      title: "Savings Strategies",
      description: "Investment readiness and debt payoff plans",
      icon: PiggyBank,
      color: "bg-purple-50 text-purple-600 border-purple-200",
      route: PROTECTED_ROUTES.AI_SAVINGS_STRATEGIES
    },
    {
      title: "Loan Manager",
      description: "Manage loans with interest calculations",
      icon: CreditCard,
      color: "bg-orange-50 text-orange-600 border-orange-200",
      route: PROTECTED_ROUTES.AI_LOAN_MANAGER
    },
    {
      title: "SIP Calculator",
      description: "SIP calculations with profit visualization",
      icon: Calculator,
      color: "bg-teal-50 text-teal-600 border-teal-200",
      route: PROTECTED_ROUTES.AI_SIP_CALCULATOR
    }
  ];

  return (
    <div className="w-full flex flex-col">
      {/* Dashboard Summary Overview */}
      <PageLayout
        className="space-y-6"
        renderPageHeader={
          <DashboardSummary
            dateRange={dateRange}
            setDateRange={_setDateRange}
          />
        }
      >
        {/* AI Features Navigation Cards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-blue-600" />
              AI-Powered Financial Tools
            </CardTitle>
            <p className="text-sm text-gray-600">
              Explore our comprehensive AI-driven financial analysis and planning tools
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {aiFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <Card 
                    key={index} 
                    className={`cursor-pointer hover:shadow-md transition-shadow ${feature.color}`}
                    onClick={() => navigate(feature.route)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <IconComponent className="h-6 w-6" />
                        <ArrowRight className="h-4 w-4 opacity-60" />
                      </div>
                      <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                      <p className="text-xs opacity-80 leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Main Section */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-6 gap-8">
          <div className="lg:col-span-4">
            <DashboardDataChart dateRange={dateRange} />
          </div>
          <div className="lg:col-span-2">
            <ExpensePieChart dateRange={dateRange} />
          </div>
        </div>

        {/* Dashboard Recent Transactions */}
        <div className="w-full mt-0">
          <DashboardRecentTransactions />
        </div>
      </PageLayout>
    </div>
  );
};

export default Dashboard;
