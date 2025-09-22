export const isAuthRoute = (pathname: string): boolean => {
    return Object.values(AUTH_ROUTES).includes(pathname);
  };
  
  export const AUTH_ROUTES = {
    SIGN_IN: "/",
    SIGN_UP: "/sign-up",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    VERIFY_EMAIL: "/verify-email",
  };
  
  export const PROTECTED_ROUTES = {
    OVERVIEW: "/overview",
    TRANSACTIONS: "/transactions",
    REPORTS: "/reports",
    SETTINGS: "/settings",
    SETTINGS_APPEARANCE: "/settings/appearance",
    // AI Dashboard Routes
    AI_FINANCIAL_HEALTH: "/ai/financial-health",
    AI_BUDGET_OPTIMIZER: "/ai/budget-optimizer",
    AI_SPENDING_INSIGHTS: "/ai/spending-insights",
    AI_SAVINGS_STRATEGIES: "/ai/savings-strategies",
    AI_LOAN_MANAGER: "/ai/loan-manager",
    AI_SIP_CALCULATOR: "/ai/sip-calculator",
  };
