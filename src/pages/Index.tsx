
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, List, BarChart3, Plus } from "lucide-react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import AddExpense from "@/components/AddExpense";
import ExpenseList from "@/components/ExpenseList";
import Analytics from "@/components/Analytics";

const Index = () => {
  const [activeTab, setActiveTab] = useState("list");

  const sidebarItems = [
    {
      title: "View Expenses",
      icon: List,
      value: "list",
    },
    {
      title: "Add Expense",
      icon: PlusCircle,
      value: "add",
    },
    {
      title: "Analytics",
      icon: BarChart3,
      value: "analytics",
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "add":
        return (
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="text-2xl font-bold text-gray-900">Add New Expense</CardTitle>
              <CardDescription className="text-gray-600">Record your expense details</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <AddExpense />
            </CardContent>
          </Card>
        );
      case "analytics":
        return (
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
              <CardTitle className="text-2xl font-bold text-gray-900">Expense Analytics</CardTitle>
              <CardDescription className="text-gray-600">Visualize your spending patterns</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <Analytics />
            </CardContent>
          </Card>
        );
      case "list":
      default:
        return (
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">Expense History</CardTitle>
                  <CardDescription className="text-gray-600">View and filter your expenses</CardDescription>
                </div>
                <Button 
                  onClick={() => setActiveTab("add")}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <ExpenseList />
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Sidebar className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <SidebarHeader className="p-6 border-b bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="text-center">
              <h2 className="text-xl font-bold text-white">Expense Tracker</h2>
              <p className="text-blue-100 text-sm">Manage your finances</p>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-4">
            <SidebarMenu className="space-y-2">
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    onClick={() => setActiveTab(item.value)}
                    isActive={activeTab === item.value}
                    className={`w-full justify-start p-4 rounded-xl transition-all duration-200 ${
                      activeTab === item.value
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-105"
                        : "hover:bg-gray-100 text-gray-700 hover:scale-102"
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <SidebarTrigger className="lg:hidden bg-white shadow-md hover:shadow-lg transition-shadow" />
              <div className="hidden lg:block">
                <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Welcome to Expense Tracker
                </h1>
                <p className="text-gray-600 mt-1">Take control of your financial journey</p>
              </div>
            </div>
            
            <div className="max-w-7xl">
              {renderContent()}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
