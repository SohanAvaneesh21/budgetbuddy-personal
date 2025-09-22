import dotenv from 'dotenv';
import mongoose from 'mongoose';
import UserModel from '../models/user.model';
import { seedUserTransactions } from '../services/seed.service';
import connctDatabase from '../config/database.config';

// Load environment variables
dotenv.config();

const seedSpecificUserAccount = async () => {
  try {
    await connctDatabase();
    console.log('Connected to database');

    // Find user by email
    const user = await UserModel.findOne({ email: 'sohanaravapalli@gmail.com' });
    
    if (!user) {
      console.log('User not found with email: sohanaravapalli@gmail.com');
      console.log('Please make sure the user account exists first');
      return;
    }

    console.log(`Found user: ${user.email}`);
    console.log(`User ID: ${user._id}`);

    // Seed transactions with force reseed to ensure fresh data
    const result = await seedUserTransactions((user._id as any).toString(), true);
    
    console.log('Seeding completed successfully!');
    console.log(`Total transactions created: ${result.count}`);
    console.log(`Total income: ₹${(result.totalIncome || 0).toLocaleString()}`);
    console.log(`Total expenses: ₹${(result.totalExpenses || 0).toLocaleString()}`);
    console.log(`Net savings: ₹${((result.totalIncome || 0) - (result.totalExpenses || 0)).toLocaleString()}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding user account:', error);
    process.exit(1);
  }
};

// Run the script
seedSpecificUserAccount();
