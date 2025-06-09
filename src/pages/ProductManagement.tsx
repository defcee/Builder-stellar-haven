import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMobilePlatform } from "@/hooks/useMobilePlatform";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Camera,
  Image as ImageIcon,
  Upload,
  X,
  Edit3,
  Trash2,
  Eye,
  MessageCircle,
  ArrowLeft,
  Save,
  DollarSign,
  Package,
  Tag,
  MapPin,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const productSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  category: z.string().min(1, "Please select a category"),
  inStock: z.boolean(),
  location: z.string().min(1, "Location is required"),
  harvestDate: z.string().optional(),
  shelfLife: z.string().optional(),
  organicCertified: z.boolean(),
  availableQuantity: z.number().min(1, "Quantity must be at least 1"),
  unit: z.string().min(1, "Please select a unit"),
});

type ProductFormData = z.infer<typeof productSchema>;

const ProductManagement: React.FC = () => {
  const navigate = useNavigate();
  const mobile = useMobilePlatform();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState("all");

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: "",
      inStock: true,
      location: "",
      harvestDate: "",
      shelfLife: "",
      organicCertified: false,
      availableQuantity: 1,
      unit: "kg",
    },
  });

  // Mock products data
  const mockProducts = [
    {
      id: "1",
      title: "Fresh Organic Tomatoes",
      description:
        "Premium quality organic tomatoes grown without pesticides. Perfect for salads and cooking. Harvested this morning for maximum freshness.",
      price: 5.99,
      category: "Vegetables",
      inStock: true,
      location: "Nairobi Farm",
      views: 45,
      inquiries: 8,
      images: ["/placeholder.svg"],
      harvestDate: "2024-01-15",
      shelfLife: "7-10 days",
      organicCertified: true,
      availableQuantity: 50,
      unit: "kg",
      createdAt: new Date(Date.now() - 86400000),
    },
    {
      id: "2",
      title: "Farm Fresh Chicken Eggs",
      description:
        "Free-range chicken eggs from happy, healthy chickens. Rich in nutrients and flavor. Collected daily for optimal freshness.",
      price: 3.49,
      category: "Dairy & Eggs",
      inStock: true,
      location: "Nairobi Farm",
      views: 32,
      inquiries: 5,
      images: ["/placeholder.svg"],
      harvestDate: "2024-01-16",
      shelfLife: "2-3 weeks",
      organicCertified: false,
      availableQuantity: 200,
      unit: "pieces",
      createdAt: new Date(Date.now() - 172800000),
    },
    {
      id: "3",
      title: "Organic Spinach Leaves",
      description:
        "Fresh, crisp organic spinach leaves. Perfect for salads, smoothies, or cooking. Grown without chemicals or pesticides.",
      price: 2.99,
      category: "Vegetables",
      inStock: false,
      location: "Nairobi Farm",
      views: 28,
      inquiries: 3,
      images: ["/placeholder.svg"],
      harvestDate: "2024-01-10",
      shelfLife: "5-7 days",
      organicCertified: true,
      availableQuantity: 0,
      unit: "bunches",
      createdAt: new Date(Date.now() - 259200000),
    },
  ];

  const categories = [
    "Vegetables",
    "Fruits",
    "Herbs & Spices",
    "Dairy & Eggs",
    "Grains & Cereals",
    "Legumes",
    "Nuts & Seeds",
    "Livestock",
    "Processed Foods",
    "Other",
  ];

  const units = [
    { value: "kg", label: "Kilograms" },
    { value: "g", label: "Grams" },
    { value: "pieces", label: "Pieces" },
    { value: "bunches", label: "Bunches" },
    { value: "bags", label: "Bags" },
    { value: "boxes", label: "Boxes" },
    { value: "liters", label: "Liters" },
    { value: "ml", label: "Milliliters" },
  ];

  const filteredProducts = mockProducts.filter((product) => {
    if (currentTab === "all") return true;
    if (currentTab === "active") return product.inStock;
    if (currentTab === "out_of_stock") return !product.inStock;
    return true;
  });

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setUploadedImages((prev) => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmitProduct = async (data: ProductFormData) => {
    try {
      await mobile.triggerHaptic("medium");

      // In a real app, this would submit to backend
      console.log("Submitting product:", { ...data, images: uploadedImages });

      toast({
        title: "Product saved!",
        description: "Your product has been added successfully.",
      });

      form.reset();
      setUploadedImages([]);
      setShowAddForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    await mobile.triggerHaptic("heavy");
    toast({
      title: "Product deleted",
      description: "The product has been removed from your listings.",
    });
  };

  const stats = {
    total: mockProducts.length,
    active: mockProducts.filter((p) => p.inStock).length,
    outOfStock: mockProducts.filter((p) => !p.inStock).length,
    totalViews: mockProducts.reduce((sum, p) => sum + p.views, 0),
    totalInquiries: mockProducts.reduce((sum, p) => sum + p.inquiries, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Product Management
                </h1>
                <p className="text-sm text-gray-600">
                  Manage your product listings
                </p>
              </div>
            </div>
            <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Create a new product listing to showcase to buyers.
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={form.handleSubmit(onSubmitProduct)}
                  className="space-y-4"
                >
                  {/* Image Upload */}
                  <div className="space-y-3">
                    <Label>Product Images</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <div className="text-center">
                        <Camera className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <Label
                          htmlFor="image-upload"
                          className="cursor-pointer"
                        >
                          <span className="text-sm text-gray-600">
                            Click to upload images
                          </span>
                          <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => handleImageUpload(e.target.files)}
                          />
                        </Label>
                      </div>
                    </div>
                    {uploadedImages.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {uploadedImages.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image}
                              alt={`Product ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                              onClick={() => removeImage(index)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Basic Information */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Product Name *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Fresh Organic Tomatoes"
                      {...form.register("title")}
                    />
                    {form.formState.errors.title && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.title.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your product, its quality, growing methods, and benefits..."
                      rows={3}
                      {...form.register("description")}
                    />
                    {form.formState.errors.description && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.description.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price *</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="pl-10"
                          {...form.register("price", { valueAsNumber: true })}
                        />
                      </div>
                      {form.formState.errors.price && (
                        <p className="text-sm text-red-600">
                          {form.formState.errors.price.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="unit">Unit *</Label>
                      <Select
                        onValueChange={(value) => form.setValue("unit", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {units.map((unit) => (
                            <SelectItem key={unit.value} value={unit.value}>
                              {unit.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.unit && (
                        <p className="text-sm text-red-600">
                          {form.formState.errors.unit.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      onValueChange={(value) =>
                        form.setValue("category", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.category && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.category.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="availableQuantity">
                        Available Quantity *
                      </Label>
                      <Input
                        id="availableQuantity"
                        type="number"
                        placeholder="1"
                        {...form.register("availableQuantity", {
                          valueAsNumber: true,
                        })}
                      />
                      {form.formState.errors.availableQuantity && (
                        <p className="text-sm text-red-600">
                          {form.formState.errors.availableQuantity.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        placeholder="Farm location"
                        {...form.register("location")}
                      />
                      {form.formState.errors.location && (
                        <p className="text-sm text-red-600">
                          {form.formState.errors.location.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="harvestDate">Harvest Date</Label>
                      <Input
                        id="harvestDate"
                        type="date"
                        {...form.register("harvestDate")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shelfLife">Shelf Life</Label>
                      <Input
                        id="shelfLife"
                        placeholder="e.g., 7-10 days"
                        {...form.register("shelfLife")}
                      />
                    </div>
                  </div>

                  {/* Switches */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="organicCertified">
                          Organic Certified
                        </Label>
                        <p className="text-sm text-gray-500">
                          This product is organically certified
                        </p>
                      </div>
                      <Switch
                        id="organicCertified"
                        checked={form.watch("organicCertified")}
                        onCheckedChange={(checked) =>
                          form.setValue("organicCertified", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="inStock">Available for Sale</Label>
                        <p className="text-sm text-gray-500">
                          Product is currently available
                        </p>
                      </div>
                      <Switch
                        id="inStock"
                        checked={form.watch("inStock")}
                        onCheckedChange={(checked) =>
                          form.setValue("inStock", checked)
                        }
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      Save Product
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-green-50 rounded-full">
                  <Package className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                  <p className="text-sm text-gray-600">Total Products</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-full">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalViews}
                  </p>
                  <p className="text-sm text-gray-600">Total Views</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-purple-50 rounded-full">
                  <MessageCircle className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalInquiries}
                  </p>
                  <p className="text-sm text-gray-600">Inquiries</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-yellow-50 rounded-full">
                  <TrendingUp className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.active}
                  </p>
                  <p className="text-sm text-gray-600">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs
          value={currentTab}
          onValueChange={setCurrentTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
            <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
            <TabsTrigger value="out_of_stock">
              Out of Stock ({stats.outOfStock})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={currentTab} className="space-y-4">
            {filteredProducts.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="font-medium text-gray-900 mb-2">
                    No products found
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {currentTab === "all"
                      ? "Start by adding your first product listing."
                      : `No ${currentTab.replace("_", " ")} products at the moment.`}
                  </p>
                  {currentTab === "all" && (
                    <Button onClick={() => setShowAddForm(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Product
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <Card key={product.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                          )}
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {product.title}
                              </h3>
                              <p className="text-lg font-bold text-green-600">
                                ${product.price} per {product.unit}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <Edit3 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {product.category}
                            </Badge>
                            <Badge
                              variant={
                                product.inStock ? "default" : "secondary"
                              }
                              className="text-xs"
                            >
                              {product.inStock ? "Available" : "Out of Stock"}
                            </Badge>
                            {product.organicCertified && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-green-50 text-green-700"
                              >
                                Organic
                              </Badge>
                            )}
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
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{product.location}</span>
                            </div>
                          </div>

                          {product.harvestDate && (
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Clock className="w-4 h-4" />
                              <span>
                                Harvested:{" "}
                                {new Date(
                                  product.harvestDate,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Navigation />
    </div>
  );
};

export default ProductManagement;
