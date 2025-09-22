import { Router } from "express";
import { 
  getFinancialHealthScore,
  getBudgetOptimization,
  getSpendingInsights,
  getSavingsStrategies,
  getLoanOptimization,
  getGoalRecommendations
} from "../controllers/ai-recommendation.controller";
import { asyncHandler } from "../middlewares/asyncHandler.middlerware";

const router = Router();

// AI Recommendation Routes (authentication handled at app level)
router.get("/financial-health", asyncHandler(getFinancialHealthScore));
router.get("/budget-optimization", asyncHandler(getBudgetOptimization));
router.get("/spending-insights", asyncHandler(getSpendingInsights));
router.get("/savings-strategies", asyncHandler(getSavingsStrategies));
router.get("/loan-optimization", asyncHandler(getLoanOptimization));
router.get("/goal-recommendations", asyncHandler(getGoalRecommendations));

export default router;
