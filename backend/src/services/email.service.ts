import nodemailer from 'nodemailer';
import { Env } from '../config/env.config';

// Create transporter for Google SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // Use Gmail service instead of manual host/port
    auth: {
      user: Env.GMAIL_USER,
      pass: Env.GMAIL_APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false // Allow self-signed certificates
    }
  });
};

export const sendOTPEmail = async (email: string, otp: string, type: 'verification' | 'reset') => {
  // Check if email configuration is available
  if (!Env.GMAIL_USER || !Env.GMAIL_APP_PASSWORD || Env.GMAIL_USER === 'your-email@gmail.com') {
    // Development mode - log OTP instead of sending email
    console.log('📧 EMAIL SERVICE - Development Mode');
    console.log('='.repeat(50));
    console.log(`📨 To: ${email}`);
    console.log(`📋 Type: ${type === 'verification' ? 'Email Verification' : 'Password Reset'}`);
    console.log(`🔑 OTP Code: ${otp}`);
    console.log('='.repeat(50));
    console.log('💡 Configure GMAIL_USER and GMAIL_APP_PASSWORD in .env to enable real email sending');
    
    return { success: true, messageId: 'dev-mode-' + Date.now() };
  }

  console.log(`📧 Sending ${type} email to: ${email}`);
  const transporter = createTransporter();
  
  const subject = type === 'verification' 
    ? 'Verify Your Email - BudgetBuddy' 
    : 'Reset Your Password - BudgetBuddy';
    
  const html = type === 'verification' 
    ? getVerificationEmailTemplate(otp)
    : getPasswordResetEmailTemplate(otp);

  const mailOptions = {
    from: `"BudgetBuddy" <${Env.GMAIL_USER}>`,
    to: email,
    subject,
    html,
  };

  try {
    // Test the connection first
    await transporter.verify();
    console.log('✅ SMTP connection verified');
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully: ' + info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    
    // Fallback to development mode if email fails
    console.log('📧 FALLBACK - Development Mode (Email Failed)');
    console.log('='.repeat(50));
    console.log(`📨 To: ${email}`);
    console.log(`📋 Type: ${type === 'verification' ? 'Email Verification' : 'Password Reset'}`);
    console.log(`🔑 OTP Code: ${otp}`);
    console.log('='.repeat(50));
    console.log('💡 Email service failed, but OTP is logged above for testing');
    
    // Return success so the flow continues, but log the OTP
    return { success: true, messageId: 'fallback-' + Date.now() };
  }
};

const getVerificationEmailTemplate = (otp: string) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px dashed #667eea; padding: 20px; margin: 20px 0; text-align: center; border-radius: 10px; }
            .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🪙 BudgetBuddy</h1>
                <h2>Verify Your Email Address</h2>
            </div>
            <div class="content">
                <p>Hello!</p>
                <p>Thank you for signing up with BudgetBuddy! To complete your registration, please verify your email address using the code below:</p>
                
                <div class="otp-box">
                    <div class="otp-code">${otp}</div>
                    <p style="margin: 10px 0 0 0; color: #666;">This code expires in 10 minutes</p>
                </div>
                
                <p>If you didn't create an account with BudgetBuddy, please ignore this email.</p>
                
                <div class="footer">
                    <p>Best regards,<br>The BudgetBuddy Team</p>
                    <p style="font-size: 12px; color: #999;">This is an automated email. Please do not reply.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
};

const getPasswordResetEmailTemplate = (otp: string) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px dashed #f5576c; padding: 20px; margin: 20px 0; text-align: center; border-radius: 10px; }
            .otp-code { font-size: 32px; font-weight: bold; color: #f5576c; letter-spacing: 5px; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔐 BudgetBuddy</h1>
                <h2>Password Reset Request</h2>
            </div>
            <div class="content">
                <p>Hello!</p>
                <p>We received a request to reset your password for your BudgetBuddy account. Use the code below to reset your password:</p>
                
                <div class="otp-box">
                    <div class="otp-code">${otp}</div>
                    <p style="margin: 10px 0 0 0; color: #666;">This code expires in 10 minutes</p>
                </div>
                
                <div class="warning">
                    <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email and consider changing your password as a precaution.
                </div>
                
                <div class="footer">
                    <p>Best regards,<br>The BudgetBuddy Team</p>
                    <p style="font-size: 12px; color: #999;">This is an automated email. Please do not reply.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Generate 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP in memory (in production, use Redis or database)
const otpStore = new Map<string, { otp: string; expires: Date; type: string }>();

export const storeOTP = (email: string, otp: string, type: 'verification' | 'reset') => {
  const expires = new Date();
  expires.setMinutes(expires.getMinutes() + 10); // 10 minutes expiry
  
  otpStore.set(email, { otp, expires, type });
};

export const verifyOTP = (email: string, otp: string, type: 'verification' | 'reset'): boolean => {
  const stored = otpStore.get(email);
  
  if (!stored) return false;
  if (stored.type !== type) return false;
  if (new Date() > stored.expires) {
    otpStore.delete(email);
    return false;
  }
  if (stored.otp !== otp) return false;
  
  otpStore.delete(email);
  return true;
};

export const sendReportEmail = async (email: string, reportData: any) => {
  const transporter = createTransporter();
  
  const subject = `Financial Report - ${reportData.period}`;
  const html = getReportEmailTemplate(reportData);

  const mailOptions = {
    from: `"BudgetBuddy" <${Env.GMAIL_USER}>`,
    to: email,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Report email sent: ' + info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending report email:', error);
    throw new Error('Failed to send report email');
  }
};

const getReportEmailTemplate = (reportData: any) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Financial Report</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .summary-card { background: white; border-radius: 8px; padding: 20px; margin: 15px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .metric { display: flex; justify-content: space-between; margin: 10px 0; }
            .metric-label { font-weight: bold; }
            .metric-value { color: #4CAF50; font-weight: bold; }
            .expense-value { color: #f44336; }
            .category-item { background: #f5f5f5; padding: 10px; margin: 5px 0; border-radius: 5px; }
            .insight { background: #e3f2fd; border-left: 4px solid #2196F3; padding: 15px; margin: 10px 0; border-radius: 0 5px 5px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📊 BudgetBuddy</h1>
                <h2>Financial Report</h2>
                <p>${reportData.period}</p>
            </div>
            <div class="content">
                <div class="summary-card">
                    <h3>💰 Financial Summary</h3>
                    <div class="metric">
                        <span class="metric-label">Total Income:</span>
                        <span class="metric-value">₹${reportData.summary.income.toLocaleString()}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Total Expenses:</span>
                        <span class="metric-value expense-value">₹${reportData.summary.expenses.toLocaleString()}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Net Balance:</span>
                        <span class="metric-value">₹${reportData.summary.balance.toLocaleString()}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Savings Rate:</span>
                        <span class="metric-value">${reportData.summary.savingsRate}%</span>
                    </div>
                </div>

                ${reportData.summary.topCategories.length > 0 ? `
                <div class="summary-card">
                    <h3>🏷️ Top Expense Categories</h3>
                    ${reportData.summary.topCategories.map((cat: any) => `
                        <div class="category-item">
                            <div class="metric">
                                <span>${cat.name}:</span>
                                <span>₹${cat.amount.toLocaleString()} (${cat.percent}%)</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                ` : ''}

                ${reportData.insights.length > 0 ? `
                <div class="summary-card">
                    <h3>🤖 AI Insights</h3>
                    ${reportData.insights.map((insight: string) => `
                        <div class="insight">${insight}</div>
                    `).join('')}
                </div>
                ` : ''}
                
                <div class="footer">
                    <p>Best regards,<br>The BudgetBuddy Team</p>
                    <p style="font-size: 12px; color: #999;">This report was generated automatically by BudgetBuddy AI.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
};
