# BudgetBuddy - AI-Powered Personal Finance Management Platform



A comprehensive MERN stack-based personal finance management platform that leverages artificial intelligence to provide intelligent financial insights, automated expense tracking, and personalized financial recommendations powered by Google's Gemini API.

## 🌟 Features

### 💰 Core Financial Management
- **Transaction Management**: Multi-category expense tracking with automated categorization
- **Real-time Analytics**: Dynamic dashboard with interactive charts and financial summaries
- **Budget Tracking**: Comprehensive budget management with goal setting and progress monitoring
- **Report Generation**: Customizable financial reports with AI-powered insights and email delivery

### 🤖 AI-Powered Intelligence
- **Financial Health Analysis**: AI-driven health scoring (0-100) with personalized recommendations
- **Smart Budget Optimization**: Dynamic budget suggestions based on spending patterns
- **Predictive Spending Insights**: Future spending forecasts and anomaly detection
- **Investment Strategies**: SIP calculator and portfolio optimization tools
- **Personalized Recommendations**: Context-aware financial advice using Gemini API

### 📊 Advanced Analytics
- **Interactive Dashboards**: Real-time data visualization with Recharts
- **Category Analysis**: Detailed spending breakdowns and trend analysis
- **Goal Tracking**: Financial goal setting with progress monitoring
- **Risk Assessment**: Automated identification of financial risks and opportunities

## 🛠️ Technology Stack

### Frontend
- **React 18+** with TypeScript for type-safe development
- **shadcn/ui** for modern, accessible UI components
- **Tailwind CSS** for responsive styling
- **Recharts** for advanced data visualization
- **RTK Query** for efficient data fetching and caching
- **React Router** for client-side routing

### Backend
- **Node.js & Express.js** for high-performance server-side operations
- **MongoDB** with Mongoose ODM for flexible document storage
- **JWT Authentication** with Passport.js for secure user management
- **Google Gemini API** for AI-powered financial analysis
- **Nodemailer** for automated email report delivery

### AI Integration
- **Google Gemini API** for advanced language model capabilities
- **Custom Prompt Engineering** for financial analysis
- **Real-time Processing** of transaction data
- **Predictive Analytics** for future financial projections

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/budgetbuddy.git
   cd budgetbuddy
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install --legacy-peer-deps
   ```

4. **Environment Setup**
   
   **Backend (.env)**
   ```env
   NODE_ENV=development
   PORT=8000
   MONGODB_URI=mongodb://localhost:27017/budgetbuddy
   JWT_SECRET=your_jwt_secret_key
   GEMINI_API_KEY=your_gemini_api_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

   **Frontend (.env)**
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

5. **Start the Application**
   
   **Backend Server**
   ```bash
   cd backend
   npm run dev
   ```

   **Frontend Development Server**
   ```bash
   cd client
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000


## 🎯 Key AI Features

### 1. Financial Health Dashboard
- Real-time health scoring algorithm
- Risk assessment and mitigation strategies
- Personalized wellness tips and recommendations

### 2. Budget Optimizer
- AI-powered budget analysis and optimization
- Category-wise spending recommendations
- Emergency fund calculations and planning

### 3. Spending Insights
- Predictive analytics for future spending patterns
- Anomaly detection for unusual transactions
- Seasonal spending pattern recognition

### 4. Investment Planning
- SIP calculator with AI recommendations
- Portfolio optimization strategies
- Risk profiling and investment guidance

## 📊 Sample Data

The application includes a comprehensive seeding system with realistic transaction data for an Indian middle-class software employee:

- **396 realistic transactions** across 12+ categories
- **₹13L annual income** with monthly salary distribution
- **₹12.8L expenses** covering all major expense categories
- **Seasonal spending patterns** and recurring transactions

## 🔐 Security Features

- JWT-based authentication with refresh tokens
- Role-based access control
- Data encryption at rest and in transit
- API rate limiting and CORS configuration
- Comprehensive input validation and sanitization

## 📈 Performance Optimizations

- Database indexing for frequently queried fields
- Efficient MongoDB aggregation pipelines
- Frontend code splitting and lazy loading
- Multi-level caching strategies
- CDN integration for static assets



## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini API** for advanced AI capabilities
- **shadcn/ui** for beautiful UI components
- **Recharts** for powerful data visualization
- **MongoDB** for flexible data storage

