import React, { useState } from "react";
import { useBusinessContext } from "@/contexts/BusinessContext";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Search,
  Filter,
  FileText,
  CreditCard,
  Wallet,
  Target,
  Calendar,
  Download,
  Eye,
  Edit,
  MoreVertical,
  ArrowLeft,
  Receipt,
  Calculator,
  PieChart as PieChartIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

const Accounting: React.FC = () => {
  const { transactions, invoices, accounts } = useBusinessContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Mock data for demonstration
  const mockTransactions = [
    {
      id: "1",
      businessId: "1",
      type: "income" as const,
      amount: 2500,
      description: "Payment from ABC Corp",
      category: "Sales Revenue",
      accountId: "1",
      paymentMethod: "Bank Transfer",
      reference: "INV-001",
      attachments: [],
      tags: ["client-payment"],
      date: new Date(Date.now() - 86400000),
      reconciled: true,
      createdBy: "1",
      createdAt: new Date(Date.now() - 86400000),
    },
    {
      id: "2",
      businessId: "1",
      type: "expense" as const,
      amount: 450,
      description: "Office Supplies",
      category: "Operating Expenses",
      accountId: "2",
      paymentMethod: "Credit Card",
      reference: "EXP-001",
      attachments: [],
      tags: ["office", "supplies"],
      date: new Date(Date.now() - 86400000 * 2),
      reconciled: false,
      createdBy: "1",
      createdAt: new Date(Date.now() - 86400000 * 2),
    },
  ];

  const mockAccounts = [
    {
      id: "1",
      businessId: "1",
      code: "1000",
      name: "Cash",
      type: "asset" as const,
      category: "Current Assets",
      balance: 45000,
      isActive: true,
      createdAt: new Date(),
    },
    {
      id: "2",
      businessId: "1",
      code: "4000",
      name: "Sales Revenue",
      type: "revenue" as const,
      category: "Operating Revenue",
      balance: 125000,
      isActive: true,
      createdAt: new Date(),
    },
    {
      id: "3",
      businessId: "1",
      code: "5000",
      name: "Operating Expenses",
      type: "expense" as const,
      category: "Operating Expenses",
      balance: 35000,
      isActive: true,
      createdAt: new Date(),
    },
  ];

  // Chart data
  const monthlyData = [
    { month: "Jan", income: 35000, expenses: 25000, profit: 10000 },
    { month: "Feb", income: 42000, expenses: 28000, profit: 14000 },
    { month: "Mar", income: 38000, expenses: 26000, profit: 12000 },
    { month: "Apr", income: 45000, expenses: 30000, profit: 15000 },
    { month: "May", income: 48000, expenses: 32000, profit: 16000 },
    { month: "Jun", income: 52000, expenses: 34000, profit: 18000 },
  ];

  const expenseByCategory = [
    { name: "Operations", value: 40, amount: 14000, color: "#3b82f6" },
    { name: "Marketing", value: 25, amount: 8750, color: "#22c55e" },
    { name: "Equipment", value: 20, amount: 7000, color: "#f59e0b" },
    { name: "Utilities", value: 15, amount: 5250, color: "#ef4444" },
  ];

  const cashFlowData = [
    { week: "W1", inflow: 12000, outflow: 8000 },
    { week: "W2", inflow: 15000, outflow: 9500 },
    { week: "W3", inflow: 18000, outflow: 12000 },
    { week: "W4", inflow: 14000, outflow: 10500 },
  ];

  const financialSummary = {
    totalRevenue: 125000,
    totalExpenses: 35000,
    netProfit: 90000,
    cashBalance: 45000,
    accountsReceivable: 15000,
    accountsPayable: 8500,
    profitMargin: 72,
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "income":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "expense":
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <DollarSign className="w-4 h-4 text-blue-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "income":
        return "text-green-600";
      case "expense":
        return "text-red-600";
      default:
        return "text-blue-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Calculator className="w-6 h-6" />
                Accounting & Finance
              </h1>
              <p className="text-sm text-gray-600">
                Financial management and reporting
              </p>
            </div>
          </div>

          {/* Period Selector */}
          <div className="flex gap-2">
            {["week", "month", "quarter", "year"].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className="capitalize"
              >
                {period}
              </Button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Financial Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        ${financialSummary.totalRevenue.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600">Total Revenue</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-100">
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        ${financialSummary.totalExpenses.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600">Total Expenses</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        ${financialSummary.netProfit.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600">Net Profit</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-yellow-100">
                      <Wallet className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        ${financialSummary.cashBalance.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600">Cash Balance</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue vs Expenses Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="w-5 h-5" />
                  Revenue vs Expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="income" fill="#22c55e" name="Income" />
                    <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Expense Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5" />
                  Expense Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie
                        data={expenseByCategory}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {expenseByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-2">
                    {expenseByCategory.map((category, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{category.name}</p>
                          <p className="text-xs text-gray-500">
                            ${category.amount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            {/* Transaction Controls */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Transactions
              </h2>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Transaction
              </Button>
            </div>

            {/* Search and Filter */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  All Types
                </Button>
                <Button variant="outline" size="sm">
                  Income
                </Button>
                <Button variant="outline" size="sm">
                  Expenses
                </Button>
              </div>
            </div>

            {/* Transaction List */}
            <div className="space-y-3">
              {mockTransactions.map((transaction) => (
                <Card
                  key={transaction.id}
                  className="border-l-4 border-l-blue-500"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-100">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {transaction.description}
                          </h3>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                            <span>{transaction.category}</span>
                            <span>{transaction.paymentMethod}</span>
                            <span>{transaction.date.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-lg font-bold ${getTransactionColor(transaction.type)}`}
                        >
                          {transaction.type === "income" ? "+" : "-"}$
                          {transaction.amount.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {transaction.reconciled ? (
                            <Badge
                              variant="outline"
                              className="text-xs bg-green-50 text-green-700"
                            >
                              Reconciled
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-xs bg-yellow-50 text-yellow-700"
                            >
                              Pending
                            </Badge>
                          )}
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="accounts" className="space-y-6">
            {/* Account Summary */}
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Chart of Accounts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockAccounts.map((account) => (
                      <div
                        key={account.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {account.code}
                            </span>
                            <h3 className="font-medium text-gray-900">
                              {account.name}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 capitalize">
                            {account.type} • {account.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            ${account.balance.toLocaleString()}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {account.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            {/* Report Options */}
            <div className="grid grid-cols-1 gap-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Profit & Loss Statement
                        </h3>
                        <p className="text-sm text-gray-600">
                          Revenue and expense summary
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-100">
                        <Receipt className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Balance Sheet
                        </h3>
                        <p className="text-sm text-gray-600">
                          Assets, liabilities, and equity
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-100">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Cash Flow Statement
                        </h3>
                        <p className="text-sm text-gray-600">
                          Cash inflows and outflows
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cash Flow Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Weekly Cash Flow
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={cashFlowData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="inflow"
                      stroke="#22c55e"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="outflow"
                      stroke="#ef4444"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Navigation />
    </div>
  );
};

export default Accounting;
