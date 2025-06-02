import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import Navigation from "@/components/Navigation";
import ReviewCard from "@/components/ReviewCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Edit3,
  MapPin,
  Calendar,
  Star,
  Eye,
  MessageCircle,
  TrendingUp,
  Settings,
  LogOut,
  Phone,
  Mail,
  Briefcase,
} from "lucide-react";
import { format } from "date-fns";

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const { products, reviews } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    location: user?.location || "",
    businessType: user?.businessType || "",
    phone: user?.phone || "",
  });

  if (!user) return null;

  const totalViews = products.reduce((sum, product) => sum + product.views, 0);
  const totalInquiries = products.reduce(
    (sum, product) => sum + product.inquiries,
    0,
  );
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  const handleSaveProfile = () => {
    // In a real app, this would save to backend
    console.log("Saving profile:", editForm);
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
  };

  // Mock reviews data
  const mockReviews = [
    {
      id: "1",
      fromUserId: "2",
      toUserId: user.id,
      rating: 5,
      comment:
        "Excellent quality produce! Always fresh and delivered on time. Highly recommended!",
      createdAt: new Date(Date.now() - 86400000),
    },
    {
      id: "2",
      fromUserId: "3",
      toUserId: user.id,
      rating: 4,
      comment:
        "Great communication and fair prices. Will definitely buy again.",
      createdAt: new Date(Date.now() - 172800000),
    },
    {
      id: "3",
      fromUserId: "4",
      toUserId: user.id,
      rating: 5,
      comment:
        "Amazing organic vegetables! You can taste the difference. Thank you!",
      createdAt: new Date(Date.now() - 259200000),
    },
  ];

  const mockReviewers = [
    { id: "2", name: "Sarah Johnson", avatar: "" },
    { id: "3", name: "Mike Chen", avatar: "" },
    { id: "4", name: "Emma Wilson", avatar: "" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Profile</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit3 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="px-4 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-lg">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-3">
                    {isEditing ? (
                      <div className="space-y-3">
                        <Input
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          placeholder="Full name"
                        />
                        <Textarea
                          value={editForm.bio}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              bio: e.target.value,
                            }))
                          }
                          placeholder="Tell us about yourself and your business..."
                          rows={3}
                        />
                      </div>
                    ) : (
                      <>
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">
                            {user.name}
                          </h2>
                          <Badge className="mt-1 capitalize">
                            {user.role.replace("_", " ")}
                          </Badge>
                        </div>
                        {user.bio && (
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {user.bio}
                          </p>
                        )}
                      </>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {isEditing ? (
                          <Input
                            value={editForm.location}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                location: e.target.value,
                              }))
                            }
                            placeholder="Location"
                            className="h-6 text-sm"
                          />
                        ) : (
                          <span>{user.location}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {format(user.createdAt, "MMM yyyy")}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-4 pt-4 border-t flex gap-2">
                    <Button onClick={handleSaveProfile} size="sm">
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Business Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Business Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Business Type
                      </p>
                      {isEditing ? (
                        <Input
                          value={editForm.businessType}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              businessType: e.target.value,
                            }))
                          }
                          placeholder="e.g., Organic Vegetables, Dairy"
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm text-gray-600">
                          {user.businessType || "Not specified"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Phone</p>
                      {isEditing ? (
                        <Input
                          value={editForm.phone}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          placeholder="Phone number"
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm text-gray-600">
                          {user.phone || "Not provided"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-blue-50 rounded-full">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalViews}
                  </p>
                  <p className="text-sm text-gray-600">Total Views</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-purple-50 rounded-full">
                    <MessageCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalInquiries}
                  </p>
                  <p className="text-sm text-gray-600">Inquiries</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-green-50 rounded-full">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {products.length}
                  </p>
                  <p className="text-sm text-gray-600">Products</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-yellow-50 rounded-full">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {avgRating.toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-600">Avg Rating</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Customer Reviews
              </h3>
              <Badge variant="secondary">{mockReviews.length} reviews</Badge>
            </div>

            {mockReviews.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="font-medium text-gray-900 mb-2">
                    No reviews yet
                  </h3>
                  <p className="text-sm text-gray-600">
                    Start selling to receive your first customer review!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {mockReviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    reviewer={mockReviewers.find(
                      (r) => r.id === review.fromUserId,
                    )}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Notification Preferences
                </Button>

                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Privacy Settings
                </Button>

                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Account Security
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Navigation />
    </div>
  );
};

export default Profile;
