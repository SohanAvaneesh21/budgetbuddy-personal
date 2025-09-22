import mongoose from "mongoose";
import { Env } from "./env.config";

const connctDatabase = async () => {
  try {
    await mongoose.connect(Env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
    });
    
    // Disable sessions for standalone MongoDB to prevent transaction errors
    mongoose.set('autoCreate', false);
    mongoose.set('autoIndex', false);
    
    console.log("Connected to MongoDB database");
  } catch (error) {
    console.error("Error connecting to MongoDB database:", error);
    process.exit(1);
  }
};

export default connctDatabase;
