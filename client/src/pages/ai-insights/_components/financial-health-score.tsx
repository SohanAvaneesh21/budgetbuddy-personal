import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { getFinancialHealth } from "@/api/ai-insights";

export function FinancialHealthScore() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['financialHealth'],
    queryFn: getFinancialHealth,
  });

  if (isLoading) return <div>Loading financial health score...</div>;
  if (error) return <div>Error loading financial health score</div>;

  const score = data?.score || 0;
  const scoreColor = 
    score >= 80 ? 'text-green-500' : 
    score >= 60 ? 'text-blue-500' : 
    score >= 40 ? 'text-yellow-500' : 'text-red-500';

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Your Financial Health Score</span>
          <span className={`text-3xl font-bold ${scoreColor}`}>{score}/100</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Progress value={score} className="h-3" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data?.breakdown?.map((item: any) => (
            <div key={item.category} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{item.category}</span>
                <span className="font-semibold">{item.score}/100</span>
              </div>
              <Progress value={item.score} className="h-2" />
            </div>
          ))}
        </div>
        {data?.recommendations && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Recommendations</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {data.recommendations.map((rec: string, i: number) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
