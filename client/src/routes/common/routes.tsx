import { AUTH_ROUTES, PROTECTED_ROUTES } from "./routePath";
import SignIn from "@/pages/auth/sign-in";
import SignUp from "@/pages/auth/sign-up";
import ForgotPassword from "@/pages/auth/forgot-password";
import Dashboard from "@/pages/dashboard";
import Transactions from "@/pages/transactions";
import Reports from "@/pages/reports";
import Settings from "@/pages/settings";
import Account from "@/pages/settings/account";
import Appearance from "@/pages/settings/appearance";
// AI Dashboard Pages
import AIFinancialHealthPage from "@/pages/ai-financial-health";
import AIBudgetOptimizerPage from "@/pages/ai-budget-optimizer";
import AISpendingInsightsPage from "@/pages/ai-spending-insights";
import AISavingsStrategiesPage from "@/pages/ai-savings-strategies";
import AILoanManagerPage from "@/pages/ai-loan-manager";
import AISIPCalculatorPage from "@/pages/ai-sip-calculator";

export const authenticationRoutePaths = [
  { path: AUTH_ROUTES.SIGN_IN, element: <SignIn /> },
  { path: AUTH_ROUTES.SIGN_UP, element: <SignUp /> },
  { path: AUTH_ROUTES.FORGOT_PASSWORD, element: <ForgotPassword /> },
];

export const protectedRoutePaths = [
  { path: PROTECTED_ROUTES.OVERVIEW, element: <Dashboard /> },
  { path: PROTECTED_ROUTES.TRANSACTIONS, element: <Transactions /> },
  { path: PROTECTED_ROUTES.REPORTS, element: <Reports /> },
  { path: PROTECTED_ROUTES.SETTINGS, 
    element: <Settings /> ,
    children: [
      { index: true, element: <Account /> }, // Default route
      { path: PROTECTED_ROUTES.SETTINGS, element: <Account /> },
      { path: PROTECTED_ROUTES.SETTINGS_APPEARANCE, element: <Appearance /> },
    ]
  },
  // AI Dashboard Routes
  { path: PROTECTED_ROUTES.AI_FINANCIAL_HEALTH, element: <AIFinancialHealthPage /> },
  { path: PROTECTED_ROUTES.AI_BUDGET_OPTIMIZER, element: <AIBudgetOptimizerPage /> },
  { path: PROTECTED_ROUTES.AI_SPENDING_INSIGHTS, element: <AISpendingInsightsPage /> },
  { path: PROTECTED_ROUTES.AI_SAVINGS_STRATEGIES, element: <AISavingsStrategiesPage /> },
  { path: PROTECTED_ROUTES.AI_LOAN_MANAGER, element: <AILoanManagerPage /> },
  { path: PROTECTED_ROUTES.AI_SIP_CALCULATOR, element: <AISIPCalculatorPage /> },
];
