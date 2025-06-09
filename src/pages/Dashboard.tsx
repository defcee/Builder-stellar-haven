import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMobilePlatform } from "@/hooks/useMobilePlatform";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Bell,
  Plus,
  TrendingUp,
  Eye,
  MessageCircle,
  Star,
  Package,
  DollarSign,
  Users,
  BarChart3,
  MapPin,
  Clock,
  Edit3,
  Sprout,
  ShoppingCart,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const mobile = useMobilePlatform();
  const [searchQuery, setSearchQuery] = useState("");

  // Mock user data
  const user = {
    name: "John Farmer",
    businessType: "Organic Vegetables",
    avatar: "",
    location: "Nairobi, Kenya",
  };

  // Mock products data
  const products = [
    {
      id: "1",
      title: "Fresh Organic Tomatoes",
      description:
        "Premium quality organic tomatoes grown without pesticides. Perfect for salads and cooking.",
      price: 5.99,
      category: "Vegetables",
      inStock: true,
      views: 45,
      inquiries: 8,
      images: ["/placeholder.svg"],
      createdAt: new Date(Date.now() - 86400000),
      harvestDate: "2024-01-15",
      availableQuantity: 50,
      unit: "kg",
    },
    {
      id: "2",
      title: "Farm Fresh Chicken Eggs",
      description:
        "Free-range chicken eggs from happy, healthy chickens. Rich in nutrients and flavor.",
      price: 3.49,
      category: "Dairy & Eggs",
      inStock: true,
      views: 32,
      inquiries: 5,
      images: ["/placeholder.svg"],
      createdAt: new Date(Date.now() - 172800000),
      harvestDate: "2024-01-16",
      availableQuantity: 200,
      unit: "pieces",
    },
    {
      id: "3",
      title: "Organic Spinach Leaves",
      description:
        "Fresh, crisp organic spinach leaves. Perfect for salads, smoothies, or cooking.",
      price: 2.99,
      category: "Vegetables",
      inStock: false,
      views: 28,
      inquiries: 3,
      images: ["/placeholder.svg"],
      createdAt: new Date(Date.now() - 259200000),
      harvestDate: "2024-01-10",
      availableQuantity: 0,
      unit: "bunches",
    },
  ];

  const stats = {
    activeProducts: products.filter((p) => p.inStock).length,
    totalViews: products.reduce((sum, p) => sum + p.views, 0),
    totalInquiries: products.reduce((sum, p) => sum + p.inquiries, 0),
    totalRevenue: 1250.5,
  };

  const recentActivities = [
    {
      id: "1",
      type: "inquiry",
      message: "New inquiry for Fresh Organic Tomatoes",
      user: "Sarah Johnson",
      time: "5 minutes ago",
      icon: MessageCircle,
      color: "text-blue-600",
    },
    {
      id: "2",
      type: "view",
      message: "Your product was viewed 3 times",
      user: "Product Analytics",
      time: "1 hour ago",
      icon: Eye,
      color: "text-green-600",
    },
    {
      id: "3",
      type: "review",
      message: "New 5-star review received",
      user: "Mike Chen",
      time: "2 hours ago",
      icon: Star,
      color: "text-yellow-600",
    },
  ];

  const handleAddProduct = async () => {
    await mobile.triggerHaptic("medium");
    navigate("/add-product");
  };

  const handleViewProduct = async (productId: string) => {
    await mobile.triggerHaptic("light");
    toast({
      title: "Product Details",
      description: "Product details feature coming soon!",
    });
  };

  const quickActions = [
    {
      title: "Add Product",
      description: "List a new product",
      icon: Plus,
      color: "bg-bizzleap-primary hover:bg-bizzleap-secondary",
      action: handleAddProduct,
    },
    {
      title: "Social Campaign",
      description: "Promote your products",
      icon: TrendingUp,
      color: "bg-blue-600 hover:bg-blue-700",
      action: () => navigate("/social-campaigns"),
    },
    {
      title: "Messages",
      description: "Chat with customers",
      icon: MessageCircle,
      color: "bg-purple-600 hover:bg-purple-700",
      action: () => navigate("/chat"),
    },
    {
      title: "Analytics",
      description: "View performance",
      icon: BarChart3,
      color: "bg-amber-600 hover:bg-amber-700",
      action: () => toast({ title: "Analytics", description: "Coming soon!" }),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="p-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-bizzleap-primary text-white">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Welcome back, {user.name.split(" ")[0]}! 👋
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Sprout className="w-4 h-4 text-bizzleap-primary" />
                    <span>{user.businessType}</span>
                  </div>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs p-0 flex items-center justify-center">
                3
              </Badge>
            </Button>
          </div>

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
      <main className="p-4 space-y-6">
        {/* Quick Stats */}
        <section>
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                icon: Package,
                value: stats.activeProducts,
                label: "Active Products",
                color: "text-bizzleap-primary",
                bgColor: "bg-bizzleap-light",
              },
              {
                icon: Eye,
                value: stats.totalViews,
                label: "Total Views",
                color: "text-blue-600",
                bgColor: "bg-blue-50",
              },
              {
                icon: MessageCircle,
                value: stats.totalInquiries,
                label: "Inquiries",
                color: "text-purple-600",
                bgColor: "bg-purple-50",
              },
              {
                icon: DollarSign,
                value: `$${stats.totalRevenue.toFixed(0)}`,
                label: "Revenue",
                color: "text-emerald-600",
                bgColor: "bg-emerald-50",
              },
            ].map((stat, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full ${stat.bgColor}`}
                    >
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                onClick={action.action}
                className={`h-auto p-4 flex flex-col items-center gap-2 ${action.color} text-white`}
              >
                <action.icon className="w-6 h-6" />
                <div className="text-center">
                  <p className="font-semibold text-sm">{action.title}</p>
                  <p className="text-xs opacity-90">{action.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h2>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              {recentActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className={`p-4 flex items-center gap-3 ${
                    index < recentActivities.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full bg-gray-50`}
                  >
                    <activity.icon className={`w-5 h-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Products Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Your Products
            </h2>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {products.length} products
              </Badge>
              <Button
                size="sm"
                onClick={() => navigate("/products")}
                variant="outline"
              >
                Manage All
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {products.slice(0, 2).map((product) => (
              <Card
                key={product.id}
                className="cursor-pointer hover:shadow-md transition-all duration-200"
                onClick={() => handleViewProduct(product.id)}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 line-clamp-1">
                            {product.title}
                          </h3>
                          <p className="text-lg font-bold text-bizzleap-primary">
                            ${product.price} per {product.unit}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {product.category}
                        </Badge>
                        <Badge
                          variant={product.inStock ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {product.inStock ? "Available" : "Out of Stock"}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{product.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{product.inquiries}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          <span>
                            {product.availableQuantity} {product.unit}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {products.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="font-medium text-gray-900 mb-2">
                    No products yet
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Start by adding your first product listing to showcase to
                    buyers.
                  </p>
                  <Button onClick={handleAddProduct}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Product
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </main>

      <Navigation />
    </div>
  );
};

export default Dashboard;
