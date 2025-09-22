import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middlerware";
import { seedUserTransactions } from "../services/seed.service";
import { HTTPSTATUS } from "../config/http.config";

const router = Router();

router.post("/transactions", asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id;
  const { forceReseed } = req.body;
  
  if (!userId) {
    return res.status(HTTPSTATUS.UNAUTHORIZED).json({
      message: "User not authenticated"
    });
  }

  const result = await seedUserTransactions(userId.toString(), forceReseed);
  
  res.status(HTTPSTATUS.OK).json({
    message: result.message,
    data: result
  });
}));

export default router;
