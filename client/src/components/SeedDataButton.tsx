import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { seedTransactions } from '@/services/api';
import { toast } from 'sonner';
import { Loader, Database } from 'lucide-react';

interface SeedDataButtonProps {
  onSuccess?: () => void;
}

export const SeedDataButton = ({ onSuccess }: SeedDataButtonProps) => {
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      const result = await seedTransactions(true); // Force reseed
      toast.success(`${result.message}. Added ${result.data.count} transactions.`);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to seed transactions');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Button 
      onClick={handleSeedData} 
      disabled={isSeeding}
      variant="outline"
      className="gap-2"
    >
      {isSeeding ? (
        <Loader className="h-4 w-4 animate-spin" />
      ) : (
        <Database className="h-4 w-4" />
      )}
      {isSeeding ? 'Adding Sample Data...' : 'Add Sample Data'}
    </Button>
  );
};
