import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useExpenses } from "@/hooks/useExpenses";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  category: z.enum(['Rental', 'Groceries', 'Entertainment', 'Travel', 'Others']),
  notes: z.string().min(1, "Notes are required"),
  date: z.date({ required_error: "Date is required" }),
  paymentMode: z.enum(['UPI', 'Credit Card', 'Net Banking', 'Cash']),
});

type FormData = z.infer<typeof formSchema>;

const AddExpense = () => {
  const { addExpense } = useExpenses();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      notes: "",
      date: new Date(),
    },
  });

  const onSubmit = (values: FormData) => {
    addExpense({
      amount: values.amount,
      category: values.category,
      notes: values.notes,
      date: format(values.date, "yyyy-MM-dd"),
      paymentMode: values.paymentMode,
    });
    
    toast({
      title: "Expense Added Successfully! 🎉",
      description: `₹${values.amount} expense for ${values.category} has been recorded.`,
    });
    
    form.reset({
      amount: 0,
      notes: "",
      date: new Date(),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold text-gray-700">Amount (₹)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="1"
                    placeholder="0.00"
                    className="h-12 text-lg border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold text-gray-700">Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12 text-lg border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Rental">🏠 Rental</SelectItem>
                    <SelectItem value="Groceries">🛒 Groceries</SelectItem>
                    <SelectItem value="Entertainment">🎬 Entertainment</SelectItem>
                    <SelectItem value="Travel">✈️ Travel</SelectItem>
                    <SelectItem value="Others">📦 Others</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-lg font-semibold text-gray-700">Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "h-12 text-lg border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-5 w-5 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-xl shadow-xl" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date()}
                      initialFocus
                      className="p-3 pointer-events-auto rounded-xl"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentMode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold text-gray-700">Payment Mode</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12 text-lg border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl">
                      <SelectValue placeholder="Select payment mode" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="UPI">📱 UPI</SelectItem>
                    <SelectItem value="Credit Card">💳 Credit Card</SelectItem>
                    <SelectItem value="Net Banking">🏦 Net Banking</SelectItem>
                    <SelectItem value="Cash">💵 Cash</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-gray-700">Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add a description for this expense..."
                  className="resize-none h-24 text-lg border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105">
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Expense
        </Button>
      </form>
    </Form>
  );
};

export default AddExpense;
