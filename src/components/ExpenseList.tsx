
import { useState, useMemo } from "react";
import { format, startOfMonth, subDays, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Filter } from "lucide-react";
import { useExpenses } from "@/hooks/useExpenses";
import { Expense, DateFilter } from "@/types/expense";
import { useToast } from "@/hooks/use-toast";

const ExpenseList = () => {
  const { expenses, deleteExpense } = useExpenses();

  const { toast } = useToast();
  
  const [dateFilter, setDateFilter] = useState<DateFilter>('All time');
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [paymentModeFilters, setPaymentModeFilters] = useState<string[]>([]);

  const categories = ['Rental', 'Groceries', 'Entertainment', 'Travel', 'Others'];
  const paymentModes = ['UPI', 'Credit Card', 'Net Banking', 'Cash'];

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const expenseDate = parseISO(expense.date);
      const now = new Date();
      
      // Date filter
      let dateMatch = true;
      switch (dateFilter) {
        case 'This month':
          dateMatch = expenseDate >= startOfMonth(now);
          break;
        case 'Last 30 days':
          dateMatch = expenseDate >= subDays(now, 30);
          break;
        case 'Last 90 days':
          dateMatch = expenseDate >= subDays(now, 90);
          break;
        case 'All time':
        default:
          dateMatch = true;
      }

      // Category filter
      const categoryMatch = categoryFilters.length === 0 || categoryFilters.includes(expense.category);
      
      // Payment mode filter
      const paymentModeMatch = paymentModeFilters.length === 0 || paymentModeFilters.includes(expense.paymentMode);

      return dateMatch && categoryMatch && paymentModeMatch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, dateFilter, categoryFilters, paymentModeFilters]);

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const handleCategoryFilter = (category: string, checked: boolean) => {
    if (checked) {
      setCategoryFilters([...categoryFilters, category]);
    } else {
      setCategoryFilters(categoryFilters.filter(c => c !== category));
    }
  };

  const handlePaymentModeFilter = (mode: string, checked: boolean) => {
    if (checked) {
      setPaymentModeFilters([...paymentModeFilters, mode]);
    } else {
      setPaymentModeFilters(paymentModeFilters.filter(m => m !== mode));
    }
  };

  const handleDelete = (id: string, amount: number) => {
    deleteExpense(id);
    toast({
      title: "Expense Deleted",
      description: `₹${amount} expense has been removed.`,
    });
  };

  const clearFilters = () => {
    setDateFilter('All time');
    setCategoryFilters([]);
    setPaymentModeFilters([]);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <Select value={dateFilter} onValueChange={(value: DateFilter) => setDateFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="This month">This month</SelectItem>
                  <SelectItem value="Last 30 days">Last 30 days</SelectItem>
                  <SelectItem value="Last 90 days">Last 90 days</SelectItem>
                  <SelectItem value="All time">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Categories</label>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={categoryFilters.includes(category)}
                      onCheckedChange={(checked) => handleCategoryFilter(category, checked as boolean)}
                    />
                    <label htmlFor={category} className="text-sm">{category}</label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Payment Modes</label>
              <div className="space-y-2">
                {paymentModes.map((mode) => (
                  <div key={mode} className="flex items-center space-x-2">
                    <Checkbox
                      id={mode}
                      checked={paymentModeFilters.includes(mode)}
                      onCheckedChange={(checked) => handlePaymentModeFilter(mode, checked as boolean)}
                    />
                    <label htmlFor={mode} className="text-sm">{mode}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Button onClick={clearFilters} variant="outline" size="sm">
            Clear All Filters
          </Button>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-bold">₹{totalAmount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Count</p>
              <p className="text-2xl font-bold">{filteredExpenses.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expense List */}
      <div className="space-y-4">
        {filteredExpenses.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No expenses found matching your filters.</p>
            </CardContent>
          </Card>
        ) : (
          filteredExpenses.map((expense) => (
            <Card key={expense.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold">₹{expense.amount.toFixed(2)}</span>
                      <Badge variant="secondary">{expense.category}</Badge>
                      <Badge variant="outline">{expense.paymentMode}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-1">{expense.notes}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(parseISO(expense.date), "PPP")}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(expense.id, expense.amount)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
