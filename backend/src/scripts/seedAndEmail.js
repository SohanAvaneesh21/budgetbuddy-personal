const axios = require('axios');
const nodemailer = require('nodemailer');

// Configuration
const API_BASE = 'http://localhost:8000/api';
const USER_EMAIL = 'sohanaravapalli@gmail.com';
const USER_PASSWORD = '123456';

// Email configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'blackspy356@gmail.com',
    pass: 'verhtyyqwfyubtks',
  },
});

async function loginUser() {
  try {
    console.log('Attempting login with:', { email: USER_EMAIL, password: USER_PASSWORD });
    const response = await axios.post(`${API_BASE}/auth/login`, {
      email: USER_EMAIL,
      password: USER_PASSWORD
    });
    console.log('Login response:', response.data);
    return response.data.accessToken;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    console.error('Full error:', error);
    throw error;
  }
}

async function seedTransactions(token) {
  try {
    console.log('Using token:', token.substring(0, 20) + '...');
    const response = await axios.post(`${API_BASE}/seed/transactions`, 
      { forceReseed: true },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Transactions seeded successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Seeding failed:', error.response?.data || error.message);
    console.error('Request headers:', error.config?.headers);
    throw error;
  }
}

async function getTransactions(token) {
  try {
    const response = await axios.get(`${API_BASE}/transaction/all`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = response.data;
    if (data.data && Array.isArray(data.data)) {
      console.log(`✅ Fetched ${data.data.length} transactions (${data.pagination.totalCount} total)`);
      return data.data;
    }
    return [];
  } catch (error) {
    console.error('Failed to get transactions:', error.response?.data || error.message);
    throw error;
  }
}

function generateMonthlyReport(transactions, month, year) {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);

  const monthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.createdAt || t.date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });

  const income = monthTransactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const expenses = monthTransactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const netSavings = income - expenses;
  const savingsRate = income > 0 ? (netSavings / income) * 100 : 0;

  // Calculate category-wise expenses
  const categoryExpenses = monthTransactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + (t.amount || 0);
      return acc;
    }, {});

  const topCategories = Object.entries(categoryExpenses)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: expenses > 0 ? (amount / expenses) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  // Generate AI-based insights
  const insights = generateAIInsights(income, expenses, netSavings, savingsRate, topCategories, monthNames[month]);

  return {
    month: monthNames[month],
    year,
    totalIncome: income,
    totalExpenses: expenses,
    netSavings,
    savingsRate,
    topExpenseCategories: topCategories,
    transactionCount: monthTransactions.length,
    aiInsights: insights
  };
}

function generateAIInsights(income, expenses, netSavings, savingsRate, topCategories, monthName) {
  const insights = [];
  
  // Savings rate analysis
  if (savingsRate >= 20) {
    insights.push(`🎉 Excellent! You maintained a ${savingsRate.toFixed(1)}% savings rate in ${monthName}. You're on track for strong financial health.`);
  } else if (savingsRate >= 10) {
    insights.push(`👍 Good job! Your ${savingsRate.toFixed(1)}% savings rate is decent. Try to increase it to 20% for optimal financial growth.`);
  } else if (savingsRate > 0) {
    insights.push(`⚠️ Your savings rate of ${savingsRate.toFixed(1)}% needs improvement. Consider reducing discretionary spending to reach 20%.`);
  } else {
    insights.push(`🚨 Alert: You spent more than you earned in ${monthName}. Review your expenses and create a strict budget.`);
  }

  // Top category insights
  if (topCategories.length > 0) {
    const topCategory = topCategories[0];
    if (topCategory.percentage > 30) {
      insights.push(`💡 ${topCategory.category} consumed ${topCategory.percentage.toFixed(1)}% of your expenses. Consider optimizing this category.`);
    }
    
    // Housing insights
    const housingCategory = topCategories.find(cat => cat.category === 'Housing');
    if (housingCategory && housingCategory.percentage > 35) {
      insights.push(`🏠 Housing costs are ${housingCategory.percentage.toFixed(1)}% of expenses. The ideal range is 25-30%.`);
    }
  }

  // Income vs expenses insights
  if (income > 0) {
    const expenseRatio = (expenses / income) * 100;
    if (expenseRatio < 50) {
      insights.push(`💰 Fantastic! You're living well below your means. Consider increasing investments.`);
    } else if (expenseRatio < 80) {
      insights.push(`✅ You're managing expenses well. Look for opportunities to optimize further.`);
    }
  }

  return insights;
}

function generateEmailHTML(reportData, userEmail) {
  const { month, year, totalIncome, totalExpenses, netSavings, savingsRate, topExpenseCategories, aiInsights } = reportData;
  
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
      .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
      .metric { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
      .metric h3 { margin: 0 0 10px 0; color: #667eea; }
      .amount { font-size: 24px; font-weight: bold; }
      .positive { color: #10b981; }
      .negative { color: #ef4444; }
      .category-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
      .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>💰 Monthly Financial Report</h1>
        <h2>${month} ${year}</h2>
        <p>Budget Buddy AI - Your Personal Finance Assistant</p>
      </div>
      
      <div class="content">
        <div class="metric">
          <h3>📈 Total Income</h3>
          <div class="amount positive">₹${totalIncome.toLocaleString()}</div>
        </div>
        
        <div class="metric">
          <h3>📉 Total Expenses</h3>
          <div class="amount negative">₹${totalExpenses.toLocaleString()}</div>
        </div>
        
        <div class="metric">
          <h3>💵 Net Savings</h3>
          <div class="amount ${netSavings >= 0 ? 'positive' : 'negative'}">₹${netSavings.toLocaleString()}</div>
          <p>Savings Rate: <strong>${savingsRate.toFixed(1)}%</strong></p>
        </div>
        
        <div class="metric">
          <h3>🏷️ Top Expense Categories</h3>
          ${topExpenseCategories.map(cat => `
            <div class="category-item">
              <span>${cat.category}</span>
              <span><strong>₹${cat.amount.toLocaleString()}</strong> (${cat.percentage.toFixed(1)}%)</span>
            </div>
          `).join('')}
        </div>
        
        <div class="metric">
          <h3>🤖 AI Financial Insights</h3>
          <ul>
            ${aiInsights.map(insight => `<li>${insight}</li>`).join('')}
          </ul>
        </div>
        
        <div class="metric">
          <h3>🎯 Personalized Recommendations</h3>
          <ul>
            <li>📊 Consider setting up automated investments for your surplus funds</li>
            <li>🛡️ Ensure you have 3-6 months of expenses in your emergency fund</li>
            <li>💳 Review and optimize your highest expense categories</li>
            <li>📈 Track your progress towards a 20% savings rate goal</li>
          </ul>
        </div>
      </div>
      
      <div class="footer">
        <p>This report was automatically generated by Budget Buddy AI</p>
        <p>Login to your dashboard for detailed insights and AI recommendations</p>
        <p>📧 Report sent to: ${userEmail}</p>
      </div>
    </div>
  </body>
  </html>
  `;
}

async function sendEmailReport(reportData, userEmail) {
  const htmlContent = generateEmailHTML(reportData, userEmail);

  const mailOptions = {
    from: '"Budget Buddy AI" <blackspy356@gmail.com>',
    to: userEmail,
    subject: `💰 Your ${reportData.month} ${reportData.year} Financial Report - Budget Buddy AI`,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
  console.log(`Monthly report sent to ${userEmail} for ${reportData.month} ${reportData.year}`);
}

async function main() {
  try {
    console.log('🔐 Logging in user...');
    const token = await loginUser();
    
    console.log('🌱 Seeding transactions...');
    const seedResult = await seedTransactions(token);
    
    console.log('📊 Fetching transactions...');
    const transactions = await getTransactions(token);
    
    console.log('📧 Generating and sending monthly reports for last 12 months...');
    const currentDate = new Date();
    
    for (let i = 0; i < 12; i++) {
      const reportDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const month = reportDate.getMonth();
      const year = reportDate.getFullYear();
      
      const reportData = generateMonthlyReport(transactions, month, year);
      
      if (reportData.transactionCount > 0) {
        await sendEmailReport(reportData, USER_EMAIL);
        // Add delay between emails to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log('✅ All done! Check your email for the monthly reports.');
    console.log(`📊 Total transactions seeded: ${seedResult.data.count}`);
    console.log(`💰 Total income: ₹${seedResult.data.totalIncome?.toLocaleString()}`);
    console.log(`💸 Total expenses: ₹${seedResult.data.totalExpenses?.toLocaleString()}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();
