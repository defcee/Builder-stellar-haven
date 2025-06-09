import React, { useState } from "react";
import { useBusinessContext } from "@/contexts/BusinessContext";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Package,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Truck,
  Factory,
  BarChart3,
  Eye,
  Edit,
  MoreVertical,
  ArrowLeft,
  ShoppingCart,
  Warehouse,
  Archive,
  Star,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const Inventory: React.FC = () => {
  const { products, suppliers, purchaseOrders } = useBusinessContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("products");
  const [stockFilter, setStockFilter] = useState("all");

  // Mock data for demonstration
  const mockProducts =
    products.length === 0
      ? [
          {
            id: "1",
            businessId: "1",
            sku: "ORG-TOM-001",
            name: "Organic Tomatoes",
            description: "Fresh organic tomatoes grown locally",
            category: "Vegetables",
            brand: "FarmFresh",
            unit: "kg",
            costPrice: 2.5,
            sellingPrice: 4.99,
            minStockLevel: 20,
            maxStockLevel: 200,
            currentStock: 85,
            location: "Warehouse A - Shelf 12",
            supplier: "Green Valley Farm",
            barcode: "1234567890123",
            images: ["/placeholder.svg"],
            isActive: true,
            tags: ["organic", "local", "fresh"],
            createdAt: new Date(Date.now() - 86400000 * 30),
            updatedAt: new Date(),
          },
          {
            id: "2",
            businessId: "1",
            sku: "EQP-TRC-001",
            name: "Farm Tractor",
            description: "Heavy-duty agricultural tractor",
            category: "Equipment",
            brand: "AgriMach",
            unit: "unit",
            costPrice: 25000,
            sellingPrice: 35000,
            minStockLevel: 1,
            maxStockLevel: 5,
            currentStock: 2,
            location: "Warehouse B - Bay 1",
            supplier: "Equipment Solutions Inc",
            barcode: "9876543210987",
            images: ["/placeholder.svg"],
            isActive: true,
            tags: ["equipment", "heavy-machinery"],
            createdAt: new Date(Date.now() - 86400000 * 60),
            updatedAt: new Date(),
          },
          {
            id: "3",
            businessId: "1",
            sku: "SED-CRN-001",
            name: "Corn Seeds",
            description: "Premium hybrid corn seeds",
            category: "Seeds",
            brand: "SeedCorp",
            unit: "bag",
            costPrice: 45,
            sellingPrice: 75,
            minStockLevel: 50,
            maxStockLevel: 500,
            currentStock: 12,
            location: "Warehouse A - Cold Storage",
            supplier: "Seed Distributors Ltd",
            barcode: "5432167890321",
            images: ["/placeholder.svg"],
            isActive: true,
            tags: ["seeds", "hybrid", "premium"],
            createdAt: new Date(Date.now() - 86400000 * 15),
            updatedAt: new Date(),
          },
        ]
      : products;

  const mockSuppliers = [
    {
      id: "1",
      businessId: "1",
      name: "Green Valley Farm",
      contactPerson: "John Smith",
      email: "john@greenvalley.com",
      phone: "+1234567890",
      address: {
        street: "123 Farm Road",
        city: "Farmville",
        state: "CA",
        zipCode: "90210",
        country: "USA",
      },
      paymentTerms: "Net 30",
      deliveryTime: 7,
      rating: 4.8,
      products: ["Organic Vegetables", "Fruits"],
      isActive: true,
      notes: "Reliable supplier with quality organic produce",
      createdAt: new Date(Date.now() - 86400000 * 180),
    },
    {
      id: "2",
      businessId: "1",
      name: "Equipment Solutions Inc",
      contactPerson: "Sarah Johnson",
      email: "sarah@equipmentsolutions.com",
      phone: "+1234567891",
      address: {
        street: "456 Industrial Ave",
        city: "Tech City",
        state: "TX",
        zipCode: "75001",
        country: "USA",
      },
      paymentTerms: "Net 60",
      deliveryTime: 14,
      rating: 4.5,
      products: ["Farm Equipment", "Machinery"],
      isActive: true,
      notes: "Specialized in agricultural equipment",
      createdAt: new Date(Date.now() - 86400000 * 90),
    },
  ];

  const mockPurchaseOrders = [
    {
      id: "1",
      businessId: "1",
      supplierId: "1",
      number: "PO-001",
      status: "confirmed" as const,
      orderDate: new Date(Date.now() - 86400000 * 5),
      expectedDate: new Date(Date.now() + 86400000 * 2),
      items: [
        {
          id: "1",
          productId: "1",
          quantity: 100,
          unitPrice: 2.5,
          receivedQuantity: 0,
          total: 250,
        },
      ],
      subtotal: 250,
      taxAmount: 25,
      total: 275,
      notes: "Weekly vegetable order",
      createdBy: "1",
      createdAt: new Date(Date.now() - 86400000 * 5),
      updatedAt: new Date(),
    },
  ];

  // Filter products based on stock levels
  const getFilteredProducts = () => {
    let filtered = mockProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });

    switch (stockFilter) {
      case "low":
        return filtered.filter((p) => p.currentStock <= p.minStockLevel);
      case "good":
        return filtered.filter(
          (p) =>
            p.currentStock > p.minStockLevel &&
            p.currentStock < p.maxStockLevel,
        );
      case "excess":
        return filtered.filter((p) => p.currentStock >= p.maxStockLevel);
      default:
        return filtered;
    }
  };

  const getStockStatus = (product: any) => {
    if (product.currentStock <= product.minStockLevel) {
      return {
        status: "low",
        color: "text-red-600 bg-red-50 border-red-200",
        icon: AlertTriangle,
      };
    } else if (product.currentStock >= product.maxStockLevel) {
      return {
        status: "excess",
        color: "text-yellow-600 bg-yellow-50 border-yellow-200",
        icon: TrendingUp,
      };
    }
    return {
      status: "good",
      color: "text-green-600 bg-green-50 border-green-200",
      icon: CheckCircle,
    };
  };

  const getStockPercentage = (product: any) => {
    return Math.min((product.currentStock / product.maxStockLevel) * 100, 100);
  };

  // Inventory stats
  const inventoryStats = {
    totalProducts: mockProducts.length,
    totalValue: mockProducts.reduce(
      (sum, p) => sum + p.currentStock * p.costPrice,
      0,
    ),
    lowStock: mockProducts.filter((p) => p.currentStock <= p.minStockLevel)
      .length,
    categories: [...new Set(mockProducts.map((p) => p.category))].length,
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
                <Package className="w-6 h-6" />
                Inventory & Supply Chain
              </h1>
              <p className="text-sm text-gray-600">
                Manage products, stock, and suppliers
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search products, SKUs, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
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
            <TabsTrigger value="products">
              Products ({mockProducts.length})
            </TabsTrigger>
            <TabsTrigger value="suppliers">
              Suppliers ({mockSuppliers.length})
            </TabsTrigger>
            <TabsTrigger value="orders">
              Orders ({mockPurchaseOrders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            {/* Inventory Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <Package className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {inventoryStats.totalProducts}
                      </p>
                      <p className="text-xs text-gray-600">Total Products</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100">
                      <BarChart3 className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        ${inventoryStats.totalValue.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600">Inventory Value</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-100">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {inventoryStats.lowStock}
                      </p>
                      <p className="text-xs text-gray-600">Low Stock Items</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100">
                      <Archive className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {inventoryStats.categories}
                      </p>
                      <p className="text-xs text-gray-600">Categories</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stock Filters */}
            <div className="flex gap-2 overflow-x-auto">
              <Button
                variant={stockFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStockFilter("all")}
              >
                All Stock
              </Button>
              <Button
                variant={stockFilter === "low" ? "default" : "outline"}
                size="sm"
                onClick={() => setStockFilter("low")}
                className="flex items-center gap-1"
              >
                <AlertTriangle className="w-3 h-3" />
                Low Stock
              </Button>
              <Button
                variant={stockFilter === "good" ? "default" : "outline"}
                size="sm"
                onClick={() => setStockFilter("good")}
                className="flex items-center gap-1"
              >
                <CheckCircle className="w-3 h-3" />
                Good Stock
              </Button>
              <Button
                variant={stockFilter === "excess" ? "default" : "outline"}
                size="sm"
                onClick={() => setStockFilter("excess")}
                className="flex items-center gap-1"
              >
                <TrendingUp className="w-3 h-3" />
                Excess Stock
              </Button>
            </div>

            {/* Product List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Product Inventory
                </h2>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>

              {getFilteredProducts().length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="font-medium text-gray-900 mb-2">
                      No products found
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Add products to start managing your inventory.
                    </p>
                    <Button>Add Your First Product</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {getFilteredProducts().map((product) => {
                    const stockStatus = getStockStatus(product);
                    const stockPercentage = getStockPercentage(product);
                    const StatusIcon = stockStatus.icon;

                    return (
                      <Card
                        key={product.id}
                        className="border-l-4 border-l-blue-500"
                      >
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <Package className="w-6 h-6 text-gray-600" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-medium text-gray-900">
                                      {product.name}
                                    </h3>
                                    <Badge className={stockStatus.color}>
                                      <StatusIcon className="w-3 h-3 mr-1" />
                                      {stockStatus.status}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    {product.sku} • {product.category}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {product.location}
                                  </p>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">
                                  Current Stock
                                </p>
                                <p className="text-sm font-medium">
                                  {product.currentStock} {product.unit}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">
                                  Min / Max
                                </p>
                                <p className="text-sm font-medium">
                                  {product.minStockLevel} /{" "}
                                  {product.maxStockLevel}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">
                                  Value
                                </p>
                                <p className="text-sm font-medium">
                                  $
                                  {(
                                    product.currentStock * product.costPrice
                                  ).toLocaleString()}
                                </p>
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-500">
                                  Stock Level
                                </span>
                                <span className="text-xs text-gray-500">
                                  {stockPercentage.toFixed(0)}%
                                </span>
                              </div>
                              <Progress
                                value={stockPercentage}
                                className="h-2"
                              />
                            </div>

                            {product.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {product.tags.map((tag, index) => (
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
                                Cost: ${product.costPrice} • Sell: $
                                {product.sellingPrice}
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
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="suppliers" className="space-y-6">
            {/* Supplier Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {mockSuppliers.length}
                      </p>
                      <p className="text-xs text-gray-600">Active Suppliers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-yellow-100">
                      <Star className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {(
                          mockSuppliers.reduce((sum, s) => sum + s.rating, 0) /
                          mockSuppliers.length
                        ).toFixed(1)}
                      </p>
                      <p className="text-xs text-gray-600">Avg Rating</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Supplier List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Supplier Network
                </h2>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Supplier
                </Button>
              </div>

              <div className="space-y-3">
                {mockSuppliers.map((supplier) => (
                  <Card
                    key={supplier.id}
                    className="border-l-4 border-l-purple-500"
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src="" />
                              <AvatarFallback>
                                {supplier.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {supplier.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {supplier.contactPerson}
                              </p>
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                <span className="text-xs text-gray-500">
                                  {supplier.rating}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Payment Terms
                            </p>
                            <p className="text-sm font-medium">
                              {supplier.paymentTerms}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Delivery Time
                            </p>
                            <p className="text-sm font-medium">
                              {supplier.deliveryTime} days
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 mb-1">Products</p>
                          <div className="flex flex-wrap gap-1">
                            {supplier.products.map((product, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {product}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                          <p className="text-xs text-gray-500">
                            {supplier.address.city}, {supplier.address.state}
                          </p>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <ShoppingCart className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            {/* Purchase Order List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Purchase Orders
                </h2>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Order
                </Button>
              </div>

              <div className="space-y-3">
                {mockPurchaseOrders.map((order) => (
                  <Card
                    key={order.id}
                    className="border-l-4 border-l-orange-500"
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-gray-900">
                                {order.number}
                              </h3>
                              <Badge
                                variant="outline"
                                className="text-xs capitalize"
                              >
                                {order.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              Supplier:{" "}
                              {
                                mockSuppliers.find(
                                  (s) => s.id === order.supplierId,
                                )?.name
                              }
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Order Date
                            </p>
                            <p className="text-sm font-medium">
                              {order.orderDate.toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Expected
                            </p>
                            <p className="text-sm font-medium">
                              {order.expectedDate.toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 mb-1">Items</p>
                          {order.items.map((item, index) => (
                            <div key={index} className="text-sm">
                              {
                                mockProducts.find(
                                  (p) => p.id === item.productId,
                                )?.name
                              }{" "}
                              - {item.quantity} units
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                          <p className="text-sm font-medium">
                            Total: ${order.total.toLocaleString()}
                          </p>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Truck className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Navigation />
    </div>
  );
};

export default Inventory;
