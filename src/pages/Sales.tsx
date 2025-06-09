import React, { useState } from "react";
import { useBusinessContext } from "@/contexts/BusinessContext";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  Plus,
  Search,
  FileText,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Download,
  MoreVertical,
  ArrowLeft,
  Receipt,
  CreditCard,
  Calendar,
  Users,
  Target,
  PieChart,
} from "lucide-react";
import { Link } from "react-router-dom";

const Sales: React.FC = () => {
  const { invoices, customers } = useBusinessContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock invoice data
  const mockInvoices = [
    {
      id: "1",
      businessId: "1",
      customerId: "1",
      number: "INV-2024-001",
      status: "paid" as const,
      issueDate: new Date(Date.now() - 86400000 * 15),
      dueDate: new Date(Date.now() - 86400000 * 5),
      subtotal: 2500,
      taxAmount: 250,
      discountAmount: 0,
      total: 2750,
      items: [
        {
          id: "1",
          productId: "1",
          description: "Organic Vegetables Package",
          quantity: 50,
          unitPrice: 50,
          taxRate: 10,
          total: 2500,
        },
      ],
      notes: "Monthly organic produce order",
      paymentStatus: "paid" as const,
      paidAmount: 2750,
      paymentDate: new Date(Date.now() - 86400000 * 10),
      createdAt: new Date(Date.now() - 86400000 * 15),
      updatedAt: new Date(Date.now() - 86400000 * 10),
    },
    {
      id: "2",
      businessId: "1",
      customerId: "1",
      number: "INV-2024-002",
      status: "sent" as const,
      issueDate: new Date(Date.now() - 86400000 * 7),
      dueDate: new Date(Date.now() + 86400000 * 23),
      subtotal: 1800,
      taxAmount: 180,
      discountAmount: 100,
      total: 1880,
      items: [
        {
          id: "1",
          productId: "2",
          description: "Farm Equipment Rental",
          quantity: 1,
          unitPrice: 1800,
          taxRate: 10,
          total: 1800,
        },
      ],
      notes: "Weekly equipment rental",
      paymentStatus: "unpaid" as const,
      paidAmount: 0,
      createdAt: new Date(Date.now() - 86400000 * 7),
      updatedAt: new Date(Date.now() - 86400000 * 7),
    },
    {
      id: "3",
      businessId: "1",
      customerId: "1",
      number: "INV-2024-003",
      status: "overdue" as const,
      issueDate: new Date(Date.now() - 86400000 * 45),
      dueDate: new Date(Date.now() - 86400000 * 15),
      subtotal: 3200,
      taxAmount: 320,
      discountAmount: 0,
      total: 3520,
      items: [
        {
          id: "1",
          productId: "1",
          description: "Premium Seeds Package",
          quantity: 40,
          unitPrice: 80,
          taxRate: 10,
          total: 3200,
        },
      ],
      notes: "Spring planting seeds order",
      paymentStatus: "unpaid" as const,
      paidAmount: 0,
      createdAt: new Date(Date.now() - 86400000 * 45),
      updatedAt: new Date(Date.now() - 86400000 * 45),
    },
  ];

  // Sales data for charts
  const monthlySales = [
    { month: "Jan", sales: 45000, invoices: 12, customers: 8 },
    { month: "Feb", sales: 52000, invoices: 15, customers: 10 },
    { month: "Mar", sales: 48000, invoices: 13, customers: 9 },
    { month: "Apr", sales: 58000, invoices: 18, customers: 12 },
    { month: "May", sales: 65000, invoices: 20, customers: 14 },
    { month: "Jun", sales: 72000, invoices: 22, customers: 16 },
  ];

  const paymentStatus = [
    { name: "Paid", value: 65, amount: 45500, color: "#22c55e" },
    { name: "Pending", value: 25, amount: 17500, color: "#f59e0b" },
    { name: "Overdue", value: 10, amount: 7000, color: "#ef4444" },
  ];

  // Filter invoices
  const filteredInvoices = mockInvoices.filter((invoice) => {
    const matchesSearch =
      invoice.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-50 text-gray-700 border-gray-200";
      case "sent":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "paid":
        return "bg-green-50 text-green-700 border-green-200";
      case "overdue":
        return "bg-red-50 text-red-700 border-red-200";
      case "cancelled":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <FileText className="w-3 h-3" />;
      case "sent":
        return <Send className="w-3 h-3" />;
      case "paid":
        return <CheckCircle className="w-3 h-3" />;
      case "overdue":
        return <AlertCircle className="w-3 h-3" />;
      case "cancelled":
        return <Clock className="w-3 h-3" />;
      default:
        return <FileText className="w-3 h-3" />;
    }
  };

  // Sales statistics
  const salesStats = {
    totalRevenue: mockInvoices.reduce((sum, inv) => sum + inv.total, 0),
    totalInvoices: mockInvoices.length,
    paidInvoices: mockInvoices.filter((inv) => inv.status === "paid").length,
    overdueInvoices: mockInvoices.filter((inv) => inv.status === "overdue")
      .length,
    averageInvoiceValue:
      mockInvoices.reduce((sum, inv) => sum + inv.total, 0) /
      mockInvoices.length,
    collectionRate:
      (mockInvoices.filter((inv) => inv.status === "paid").length /
        mockInvoices.length) *
      100,
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
                <Receipt className="w-6 h-6" />
                Sales & Invoicing
              </h1>
              <p className="text-sm text-gray-600">
                Manage sales, invoices, and payments
              </p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                All
              </Button>
              {["draft", "sent", "paid", "overdue"].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className="capitalize"
                >
                  {status}
                </Button>
              ))}
            </div>
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="invoices">
              Invoices ({mockInvoices.length})
            </TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Sales Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100">
                      <DollarSign className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        ${salesStats.totalRevenue.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600">Total Revenue</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {salesStats.totalInvoices}
                      </p>
                      <p className="text-xs text-gray-600">Total Invoices</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-yellow-100">
                      <Target className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        ${salesStats.averageInvoiceValue.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600">Avg Invoice Value</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {salesStats.collectionRate.toFixed(0)}%
                      </p>
                      <p className="text-xs text-gray-600">Collection Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Button className="h-auto p-4 flex-col gap-2">
                <Plus className="w-6 h-6" />
                <span>Create Invoice</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                <Send className="w-6 h-6" />
                <span>Send Reminders</span>
              </Button>
            </div>

            {/* Recent Invoices */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Invoices</span>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/sales?tab=invoices">View All</Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockInvoices.slice(0, 3).map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-100">
                          {getStatusIcon(invoice.status)}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {invoice.number}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Due: {invoice.dueDate.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          ${invoice.total.toLocaleString()}
                        </p>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Status Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {paymentStatus.map((status, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {status.name}
                        </span>
                        <span className="text-sm text-gray-600">
                          ${status.amount.toLocaleString()} ({status.value}%)
                        </span>
                      </div>
                      <Progress value={status.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-6">
            {/* Invoice Actions */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Invoice Management
              </h2>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Create Invoice
              </Button>
            </div>

            {/* Invoice List */}
            <div className="space-y-3">
              {filteredInvoices.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="font-medium text-gray-900 mb-2">
                      No invoices found
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Create your first invoice to start managing sales.
                    </p>
                    <Button>Create Invoice</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {filteredInvoices.map((invoice) => (
                    <Card
                      key={invoice.id}
                      className="border-l-4 border-l-blue-500"
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-gray-900">
                                  {invoice.number}
                                </h3>
                                <Badge
                                  className={getStatusColor(invoice.status)}
                                >
                                  {getStatusIcon(invoice.status)}
                                  <span className="ml-1 capitalize">
                                    {invoice.status}
                                  </span>
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">
                                Customer:{" "}
                                {customers.find(
                                  (c) => c.id === invoice.customerId,
                                )?.name || "Unknown"}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">
                                Issue Date
                              </p>
                              <p className="text-sm font-medium">
                                {invoice.issueDate.toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">
                                Due Date
                              </p>
                              <p className="text-sm font-medium">
                                {invoice.dueDate.toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500 mb-1">Items</p>
                            {invoice.items.map((item, index) => (
                              <div
                                key={index}
                                className="text-sm text-gray-700"
                              >
                                {item.description} - {item.quantity} × $
                                {item.unitPrice}
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t">
                            <div>
                              <p className="text-lg font-bold text-gray-900">
                                ${invoice.total.toLocaleString()}
                              </p>
                              {invoice.status === "paid" &&
                                invoice.paymentDate && (
                                  <p className="text-xs text-green-600">
                                    Paid on{" "}
                                    {invoice.paymentDate.toLocaleDateString()}
                                  </p>
                                )}
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="w-4 h-4" />
                              </Button>
                              {invoice.status === "sent" && (
                                <Button variant="ghost" size="sm">
                                  <Send className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Sales Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Sales Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={monthlySales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#22c55e"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="w-5 h-5" />
                  Monthly Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={monthlySales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="invoices" fill="#3b82f6" name="Invoices" />
                    <Bar dataKey="customers" fill="#f59e0b" name="Customers" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Monthly Growth
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        +12.5%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Customer Retention
                      </span>
                      <span className="text-sm font-medium">94%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Average Days to Pay
                      </span>
                      <span className="text-sm font-medium">18 days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Invoice Accuracy
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        99.2%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Navigation />
    </div>
  );
};

export default Sales;
