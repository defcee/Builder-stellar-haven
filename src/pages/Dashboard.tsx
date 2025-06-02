import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import Navigation from "@/components/Navigation";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  TrendingUp,
  Eye,
  MessageCircle,
  Star,
  Bell,
  Menu,
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { products } = useApp();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalViews = products.reduce((sum, product) => sum + product.views, 0);
  const totalInquiries = products.reduce(
    (sum, product) => sum + product.inquiries,
    0,
  );
  const activeProducts = products.filter((product) => product.inStock).length;

  const stats = [
    {
      title: "Active Products",
      value: activeProducts,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Views",
      value: totalViews,
      icon: Eye,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Inquiries",
      value: totalInquiries,
      icon: MessageCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Rating",
      value: "4.8",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Welcome back, {user?.name?.split(" ")[0]}! 👋
              </h1>
              <p className="text-sm text-gray-600">
                {user?.businessType || "Manage your business"}
              </p>
            </div>
            <Button variant="ghost" size="sm">
              <Bell className="w-5 h-5" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search your products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 space-y-6">
        {/* Quick Stats */}
        <section>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-600">{stat.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <div className="grid grid-cols-2 gap-4">
            <Button asChild className="h-auto p-4 flex-col gap-2">
              <Link to="/add-product">
                <Plus className="w-6 h-6" />
                <span className="text-sm">Add Product</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto p-4 flex-col gap-2"
            >
              <Link to="/social-campaigns">
                <TrendingUp className="w-6 h-6" />
                <span className="text-sm">Campaigns</span>
              </Link>
            </Button>
          </div>
        </section>

        {/* Your Products */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Your Products
            </h2>
            {products.length > 0 && (
              <Badge variant="secondary">
                {filteredProducts.length} of {products.length}
              </Badge>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <Card className="border-dashed border-2 border-gray-200">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Plus className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">
                  No products yet
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Start by adding your first product to showcase to potential
                  buyers.
                </p>
                <Button asChild>
                  <Link to="/add-product">Add Your First Product</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={() => {
                    // Handle edit - would navigate to edit page
                    console.log("Edit product:", product.id);
                  }}
                  showStats={true}
                />
              ))}
            </div>
          )}
        </section>

        {/* Recent Activity */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h2>
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Eye className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      Your product "Fresh Organic Tomatoes" was viewed 5 times
                    </p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      New inquiry about "Farm Fresh Eggs"
                    </p>
                    <p className="text-xs text-gray-500">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      You received a 5-star review!
                    </p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Navigation />
    </div>
  );
};

export default Dashboard;
