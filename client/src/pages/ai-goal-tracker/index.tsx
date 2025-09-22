import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target, Calculator, TrendingUp, Lightbulb, Plus } from "lucide-react";
import { PageLayout } from "@/components/layout/page-layout";

interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  monthlySavings: number;
}

export default function AIGoalTrackerPage() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "House Down Payment",
      targetAmount: 1500000,
      monthlySavings: 25000
    },
    {
      id: "2", 
      title: "Emergency Fund",
      targetAmount: 300000,
      monthlySavings: 15000
    },
    {
      id: "3",
      title: "Dream Vacation",
      targetAmount: 200000,
      monthlySavings: 10000
    }
  ]);

  const [newGoal, setNewGoal] = useState({
    title: "",
    targetAmount: "",
    monthlySavings: ""
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const calculateMonthsToReach = (targetAmount: number, monthlySavings: number) => {
    if (monthlySavings <= 0) return "∞";
    return Math.ceil(targetAmount / monthlySavings);
  };

  const addGoal = () => {
    if (!newGoal.title || !newGoal.targetAmount || !newGoal.monthlySavings) return;
    
    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      targetAmount: parseFloat(newGoal.targetAmount),
      monthlySavings: parseFloat(newGoal.monthlySavings)
    };
    
    setGoals([...goals, goal]);
    setNewGoal({ title: "", targetAmount: "", monthlySavings: "" });
    setShowAddForm(false);
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const getRecommendation = (targetAmount: number, monthlySavings: number) => {
    const months = calculateMonthsToReach(targetAmount, monthlySavings);
    const years = typeof months === 'number' ? (months / 12).toFixed(1) : "∞";
    
    if (typeof months === 'number') {
      if (months <= 12) {
        return `Great! You can reach this goal in ${months} months (${years} years). Keep up the consistent savings!`;
      } else if (months <= 36) {
        return `Good plan! This goal will take ${months} months (${years} years). Consider increasing monthly savings if possible.`;
      } else {
        return `This is a long-term goal (${months} months / ${years} years). Consider increasing monthly savings or breaking it into smaller milestones.`;
      }
    }
    return "Please set a monthly savings amount to get recommendations.";
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">AI Goal Tracker</h1>
            <p className="text-muted-foreground">Set financial goals and get AI recommendations</p>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Goal
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <Card key={goal.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    {goal.title}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteGoal(goal.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Target Amount:</span>
                    <span className="text-lg font-bold text-green-600">₹{goal.targetAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Monthly Savings:</span>
                    <span className="text-lg font-bold text-blue-600">₹{goal.monthlySavings.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">Time to Reach:</span>
                    <span className="text-lg font-bold text-purple-600">
                      {calculateMonthsToReach(goal.targetAmount, goal.monthlySavings)} months
                    </span>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">AI Recommendation:</p>
                      <p className="text-xs text-blue-700 mt-1">
                        {getRecommendation(goal.targetAmount, goal.monthlySavings)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Goal Form */}
        {showAddForm && (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Add New Goal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Goal Title</Label>
                <Input
                  id="title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="e.g., House Down Payment"
                />
              </div>
              <div>
                <Label htmlFor="targetAmount">Target Amount (₹)</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                  placeholder="1500000"
                />
              </div>
              <div>
                <Label htmlFor="monthlySavings">Monthly Savings (₹)</Label>
                <Input
                  id="monthlySavings"
                  type="number"
                  value={newGoal.monthlySavings}
                  onChange={(e) => setNewGoal({ ...newGoal, monthlySavings: e.target.value })}
                  placeholder="25000"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={addGoal} className="flex-1">
                  Add Goal
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
}
