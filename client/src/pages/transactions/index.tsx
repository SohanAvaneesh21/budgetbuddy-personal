import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import PageLayout from "@/components/page-layout";
import AddTransactionDrawer from "@/components/transaction/add-transaction-drawer";
import TransactionTable from "@/components/transaction/transaction-table";
import { useGetAllTransactionsQuery } from "@/features/transaction/transactionAPI";

export default function Transactions() {
  // Use the same API call that the table uses with polling to ensure fresh data
  const { data, isFetching: loading } = useGetAllTransactionsQuery({
    pageNumber: 1,
    pageSize: 1000, // Get all transactions for download
  }, {
    // Refetch every 30 seconds to ensure fresh data
    pollingInterval: 30000,
    // Refetch on focus
    refetchOnFocus: true,
    // Refetch on reconnect
    refetchOnReconnect: true,
  });

  const transactions = data?.transations || [];

  // Debug: Log the data to see what we're getting
  console.log('Transaction data:', data);
  console.log('Loading state:', loading);

  const downloadExcel = () => {
    if (!transactions || transactions.length === 0) {
      alert('No transactions to download');
      return;
    }

    // Create CSV content with all columns shown in the table
    const headers = [
      'Date Created',
      'Title', 
      'Category',
      'Type',
      'Amount',
      'Transaction Date',
      'Payment Method',
      'Frequency',
      'Next Recurring Date',
      'Description'
    ];
    
    const csvContent = [
      headers.join(','),
      ...transactions.map((transaction: any) => {
        // Format amount with proper sign and currency
        const amount = transaction.type === 'EXPENSE' 
          ? `-₹${Math.abs(transaction.amount).toLocaleString()}` 
          : `+₹${Math.abs(transaction.amount).toLocaleString()}`;
        
        // Format payment method
        const paymentMethod = transaction.paymentMethod 
          ? transaction.paymentMethod.replace('_', ' ').toLowerCase()
          : 'N/A';
        
        // Format frequency (check if properties exist)
        const frequency = (transaction as any).isRecurring && (transaction as any).recurringInterval
          ? (transaction as any).recurringInterval.toLowerCase()
          : 'One-time';
        
        // Format next recurring date (check if properties exist)
        const nextRecurringDate = (transaction as any).nextRecurringDate && (transaction as any).isRecurring
          ? new Date((transaction as any).nextRecurringDate).toLocaleDateString()
          : '';

        return [
          new Date(transaction.createdAt).toLocaleDateString(),
          `"${transaction.title}"`,
          transaction.category,
          transaction.type,
          `"${amount}"`,
          new Date(transaction.date).toLocaleDateString(),
          paymentMethod,
          frequency,
          nextRecurringDate,
          `"${transaction.description || ''}"`
        ].join(',');
      })
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `BudgetBuddy_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <PageLayout
      title="All Transactions"
      subtitle="Showing all transactions"
      addMarginTop
      rightAction={
        <div className="flex items-center gap-2">
          <Button 
            onClick={downloadExcel}
            disabled={loading || !transactions?.length}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Excel
          </Button>
          <AddTransactionDrawer />
        </div>
      }
    >
      <Card className="border-0 shadow-none">
        <CardContent className="pt-2">
          <TransactionTable pageSize={20} />
        </CardContent>
      </Card>
    </PageLayout>
  );
}
