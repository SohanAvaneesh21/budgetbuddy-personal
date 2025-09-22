import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { getBudgetOptimization } from "@/api/ai-insights";

export function SmartBudgetOptimization() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['budgetOptimization'],
    queryFn: getBudgetOptimization,
  });

  if (isLoading) return <div>Loading budget optimization...</div>;
  if (error) return <div>Error loading budget optimization</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Smart Budget Optimization</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Current Month Budget</h3>
          <div className="space-y-4">
            {data?.categories?.map((category: any) => (
              <div key={category.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{category.name}</span>
                  <span>{category.spent} / {category.budget} ({category.percentage}%)</span>
                </div>
                <Progress 
                  value={category.percentage} 
                  className={`h-2 ${
                    category.percentage > 90 ? 'bg-red-500' : 
                    category.percentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                  }`} 
                />
              </div>
            ))}
          </div>
        </div>

        {data?.suggestions && (
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">AI Suggestions</h3>
            <ul className="space-y-2">
              {data.suggestions.map((suggestion: string, i: number) => (
                <li key={i} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-medium">Savings Goal</h3>
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between mb-2">
                <span>Target: ₹{data?.savingsGoal?.target}</span>
                <span>{data?.savingsGoal?.progress}%</span>
              </div>
              <Progress value={data?.savingsGoal?.progress || 0} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                {data?.savingsGoal?.suggestion}
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Potential Savings</h3>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold mb-2">₹{data?.potentialSavings?.amount}</div>
              <p className="text-sm text-muted-foreground">
                {data?.potentialSavings?.description}
              </p>
              <Button size="sm" className="mt-3 w-full">
                Optimize Budget
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
