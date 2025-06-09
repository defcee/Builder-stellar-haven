import React, { useState } from "react";
import { useBusinessContext } from "@/contexts/BusinessContext";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  UserPlus,
  Search,
  Phone,
  Mail,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Star,
  Clock,
  Target,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

const CRM: React.FC = () => {
  const { leads, customers, addLead, addCustomer, updateLead } =
    useBusinessContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("leads");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Mock lead data if empty
  const mockLeads =
    leads.length === 0
      ? [
          {
            id: "1",
            businessId: "1",
            name: "Michael Johnson",
            email: "michael@techcorp.com",
            phone: "+1234567890",
            company: "TechCorp Solutions",
            source: "website" as const,
            status: "qualified" as const,
            value: 15000,
            probability: 75,
            assignedTo: "1",
            notes: "Interested in our premium package",
            tags: ["enterprise", "high-value"],
            activities: [],
            createdAt: new Date(Date.now() - 86400000 * 3),
            updatedAt: new Date(),
          },
          {
            id: "2",
            businessId: "1",
            name: "Sarah Wilson",
            email: "sarah@startup.com",
            phone: "+1234567891",
            company: "StartupCo",
            source: "referral" as const,
            status: "new" as const,
            value: 8000,
            probability: 30,
            assignedTo: "1",
            notes: "New startup looking for automation solutions",
            tags: ["startup", "potential"],
            activities: [],
            createdAt: new Date(Date.now() - 86400000 * 1),
            updatedAt: new Date(),
          },
        ]
      : leads;

  const mockCustomers =
    customers.length === 0
      ? [
          {
            id: "1",
            businessId: "1",
            name: "ABC Manufacturing",
            email: "contact@abcmanufacturing.com",
            phone: "+1555123456",
            company: "ABC Manufacturing",
            address: {
              street: "123 Industrial Blvd",
              city: "Manufacturing City",
              state: "CA",
              zipCode: "90210",
              country: "USA",
            },
            type: "business" as const,
            status: "active" as const,
            creditLimit: 50000,
            paymentTerms: "Net 30",
            totalPurchases: 125000,
            lastPurchase: new Date(Date.now() - 86400000 * 7),
            notes: "Long-term customer with excellent payment history",
            tags: ["VIP", "Manufacturing"],
            createdAt: new Date(Date.now() - 86400000 * 365),
            updatedAt: new Date(),
          },
        ]
      : customers;

  const filteredLeads = mockLeads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || lead.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredCustomers = mockCustomers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "contacted":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "qualified":
        return "bg-green-50 text-green-700 border-green-200";
      case "proposal":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "negotiation":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "won":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "lost":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const leadStats = {
    total: mockLeads.length,
    qualified: mockLeads.filter((l) => l.status === "qualified").length,
    proposal: mockLeads.filter((l) => l.status === "proposal").length,
    won: mockLeads.filter((l) => l.status === "won").length,
    totalValue: mockLeads.reduce((sum, lead) => sum + lead.value, 0),
    avgProbability:
      mockLeads.reduce((sum, lead) => sum + lead.probability, 0) /
        mockLeads.length || 0,
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
                <Users className="w-6 h-6" />
                CRM
              </h1>
              <p className="text-sm text-gray-600">
                Customer Relationship Management
              </p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search leads and customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant={selectedStatus === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus("all")}
              >
                All
              </Button>
              {["new", "qualified", "proposal", "won"].map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="leads">Leads ({mockLeads.length})</TabsTrigger>
            <TabsTrigger value="customers">
              Customers ({mockCustomers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leads" className="space-y-6">
            {/* Lead Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <Target className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {leadStats.qualified}
                      </p>
                      <p className="text-xs text-gray-600">Qualified Leads</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100">
                      <DollarSign className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        ${leadStats.totalValue.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600">Pipeline Value</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lead List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Active Leads
                </h2>
                <Button size="sm">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Lead
                </Button>
              </div>

              {filteredLeads.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="font-medium text-gray-900 mb-2">
                      No leads found
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Start building your sales pipeline by adding leads.
                    </p>
                    <Button>Add Your First Lead</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {filteredLeads.map((lead) => (
                    <Card
                      key={lead.id}
                      className="border-l-4 border-l-blue-500"
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-medium text-gray-900">
                                  {lead.name}
                                </h3>
                                <Badge className={getStatusColor(lead.status)}>
                                  {lead.status}
                                </Badge>
                              </div>
                              {lead.company && (
                                <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                                  <Building className="w-3 h-3" />
                                  {lead.company}
                                </p>
                              )}
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {lead.email}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {lead.phone}
                                </span>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">
                                Value
                              </p>
                              <p className="text-sm font-medium">
                                ${lead.value.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">
                                Probability
                              </p>
                              <div className="flex items-center gap-2">
                                <Progress
                                  value={lead.probability}
                                  className="h-2 flex-1"
                                />
                                <span className="text-xs font-medium">
                                  {lead.probability}%
                                </span>
                              </div>
                            </div>
                          </div>

                          {lead.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {lead.tags.map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t">
                            <p className="text-xs text-gray-500">
                              <Calendar className="w-3 h-3 inline mr-1" />
                              {lead.createdAt.toLocaleDateString()}
                            </p>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
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

          <TabsContent value="customers" className="space-y-6">
            {/* Customer Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100">
                      <Users className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {mockCustomers.length}
                      </p>
                      <p className="text-xs text-gray-600">Active Customers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-yellow-100">
                      <TrendingUp className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        $
                        {mockCustomers
                          .reduce((sum, c) => sum + c.totalPurchases, 0)
                          .toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600">Total Revenue</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Customer List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Customer Database
                </h2>
                <Button size="sm">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Customer
                </Button>
              </div>

              {filteredCustomers.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="font-medium text-gray-900 mb-2">
                      No customers found
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Build your customer database to track relationships and
                      sales.
                    </p>
                    <Button>Add Your First Customer</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {filteredCustomers.map((customer) => (
                    <Card
                      key={customer.id}
                      className="border-l-4 border-l-green-500"
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src="" />
                                <AvatarFallback>
                                  {customer.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-medium text-gray-900">
                                    {customer.name}
                                  </h3>
                                  <Badge variant="outline" className="text-xs">
                                    {customer.type}
                                  </Badge>
                                </div>
                                {customer.company && (
                                  <p className="text-sm text-gray-600 flex items-center gap-1">
                                    <Building className="w-3 h-3" />
                                    {customer.company}
                                  </p>
                                )}
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">
                                Total Purchases
                              </p>
                              <p className="text-sm font-medium">
                                ${customer.totalPurchases.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">
                                Last Purchase
                              </p>
                              <p className="text-sm font-medium">
                                {customer.lastPurchase?.toLocaleDateString() ||
                                  "Never"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {customer.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {customer.phone}
                            </span>
                          </div>

                          {customer.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {customer.tags.map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t">
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              Customer since{" "}
                              {customer.createdAt.toLocaleDateString()}
                            </p>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
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
        </Tabs>
      </main>

      <Navigation />
    </div>
  );
};

export default CRM;
