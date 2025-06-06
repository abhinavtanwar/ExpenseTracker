
import { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format, parseISO, startOfMonth } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useExpenses } from "@/hooks/useExpenses";

const Analytics = () => {
  const { expenses } = useExpenses();
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [showLifetime, setShowLifetime] = useState(true);

  const chartData = useMemo(() => {
    // Group expenses by month and category
    const monthlyData: { [key: string]: { [category: string]: number } } = {};
    
    expenses.forEach((expense) => {
      const date = parseISO(expense.date);
      const monthKey = format(startOfMonth(date), "MMM yyyy");
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          Rental: 0,
          Groceries: 0,
          Entertainment: 0,
          Travel: 0,
          Others: 0,
        };
      }
      
      monthlyData[monthKey][expense.category] += expense.amount;
    });

    // Convert to array format for recharts
    return Object.entries(monthlyData)
      .map(([month, categories]) => ({
        month,
        ...categories,
        total: Object.values(categories).reduce((sum, amount) => sum + amount, 0),
      }))
      .sort((a, b) => {
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateA.getTime() - dateB.getTime();
      });
  }, [expenses]);

  const availableMonths = useMemo(() => {
    return chartData.map(item => item.month);
  }, [chartData]);

  const categoryBreakdownData = useMemo(() => {
    if (showLifetime) {
      // Show lifetime category breakdown
      return expenses.reduce((totals, expense) => {
        totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
        return totals;
      }, {} as { [key: string]: number });
    } else if (selectedMonth) {
      // Show category breakdown for selected month
      return expenses
        .filter(expense => {
          const expenseDate = parseISO(expense.date);
          const monthKey = format(startOfMonth(expenseDate), "MMM yyyy");
          return monthKey === selectedMonth;
        })
        .reduce((totals, expense) => {
          totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
          return totals;
        }, {} as { [key: string]: number });
    }
    return {};
  }, [expenses, selectedMonth, showLifetime]);

  const categoryColors = {
    Rental: "#8884d8",
    Groceries: "#82ca9d",
    Entertainment: "#ffc658",
    Travel: "#ff7300",
    Others: "#8dd1e1",
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const currentMonthExpenses = expenses
    .filter(expense => {
      const expenseDate = parseISO(expense.date);
      const now = new Date();
      return expenseDate >= startOfMonth(now);
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const categoryTotal = Object.values(categoryBreakdownData).reduce((sum, amount) => sum + amount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{currentMonthExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Monthly</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{chartData.length > 0 ? (totalExpenses / chartData.length).toFixed(2) : '0.00'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Category Breakdown</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex gap-2">
                <Button
                  variant={showLifetime ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowLifetime(true)}
                >
                  Lifetime
                </Button>
                <Button
                  variant={!showLifetime ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowLifetime(false)}
                >
                  Monthly
                </Button>
              </div>
              {!showLifetime && (
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMonths.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {Object.keys(categoryBreakdownData).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {!showLifetime && !selectedMonth 
                ? "Please select a month to view category breakdown"
                : "No data available for the selected period"
              }
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(categoryBreakdownData).map(([category, amount]) => (
                <div key={category} className="text-center">
                  <div 
                    className="w-full h-2 rounded-full mb-2"
                    style={{ backgroundColor: categoryColors[category as keyof typeof categoryColors] }}
                  />
                  <p className="text-sm font-medium">{category}</p>
                  <p className="text-lg font-bold">₹{amount.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">
                    {categoryTotal > 0 ? ((amount / categoryTotal) * 100).toFixed(1) : 0}%
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monthly Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Expense Trends</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No data available for chart. Add some expenses to see analytics.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip 
                  formatter={(value: number) => [`₹${value.toFixed(2)}`, '']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Legend />
                {Object.entries(categoryColors).map(([category, color]) => (
                  <Bar 
                    key={category}
                    dataKey={category} 
                    stackId="a" 
                    fill={color}
                    name={category}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
