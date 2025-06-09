import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMobilePlatform } from "@/hooks/useMobilePlatform";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Edit3,
  MapPin,
  Calendar,
  Star,
  Eye,
  MessageCircle,
  Package,
  Settings,
  Shield,
  Bell,
  LogOut,
  Save,
  Camera,
  Phone,
  Mail,
  Globe,
  Award,
  TrendingUp,
  Users,
  Briefcase,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const mobile = useMobilePlatform();
  const [currentTab, setCurrentTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "John Farmer",
    email: "john@example.com",
    phone: "+254 712 345 678",
    role: "farmer",
    location: "Nairobi, Kenya",
    businessType: "Organic Vegetables",
    bio: "Passionate farmer growing organic vegetables for the local community. Committed to sustainable farming practices and providing fresh, healthy produce.",
    website: "https://johnsfarm.com",
    avatar: "",
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    profileVisibility: true,
    showContact: true,
  });

  // Mock data
  const stats = {
    totalViews: 1247,
    totalInquiries: 89,
    products: 5,
    avgRating: 4.8,
    totalSales: 156,
    joinDate: new Date("2023-06-15"),
  };

  const reviews = [
    {
      id: "1",
      reviewer: { name: "Sarah Johnson", avatar: "" },
      rating: 5,
      comment:
        "Excellent quality produce! Always fresh and delivered on time. John is very professional and responsive to questions. Highly recommended!",
      createdAt: new Date(Date.now() - 86400000),
    },
    {
      id: "2",
      reviewer: { name: "Mike Chen", avatar: "" },
      rating: 4,
      comment:
        "Great communication and fair prices. The tomatoes were delicious and lasted longer than store-bought ones.",
      createdAt: new Date(Date.now() - 172800000),
    },
    {
      id: "3",
      reviewer: { name: "Emma Wilson", avatar: "" },
      rating: 5,
      comment:
        "Amazing organic vegetables! You can really taste the difference. John takes great care in growing his produce.",
      createdAt: new Date(Date.now() - 259200000),
    },
  ];

  const achievements = [
    {
      title: "Top Seller",
      description: "Achieved top seller status this month",
      icon: Award,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "5-Star Rating",
      description: "Maintained 5-star average rating",
      icon: Star,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Trusted Farmer",
      description: "Verified organic certification",
      icon: Shield,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  const handleSaveProfile = async () => {
    await mobile.triggerHaptic("medium");
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleLogout = async () => {
    await mobile.triggerHaptic("heavy");
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    setTimeout(() => navigate("/"), 1000);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="p-4">
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

      <main className="p-4">
        <Tabs
          value={currentTab}
          onValueChange={setCurrentTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Profile Card */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Profile Header */}
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <Avatar className="w-20 h-20">
                        <AvatarImage
                          src={profileData.avatar}
                          alt={profileData.name}
                        />
                        <AvatarFallback className="bg-bizzleap-primary text-white text-xl">
                          {profileData.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button
                          size="sm"
                          className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0"
                        >
                          <Camera className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="flex-1 space-y-3">
                      {isEditing ? (
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                              id="name"
                              value={profileData.name}
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  name: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="businessType">Business Type</Label>
                            <Input
                              id="businessType"
                              value={profileData.businessType}
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  businessType: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">
                            {profileData.name}
                          </h2>
                          <Badge className="bg-bizzleap-light text-bizzleap-secondary">
                            {profileData.role.replace("_", " ").toUpperCase()}
                          </Badge>
                          <p className="text-lg text-gray-600 mt-1">
                            {profileData.businessType}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    {isEditing ? (
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={profileData.bio}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              bio: e.target.value,
                            })
                          }
                          rows={3}
                        />
                      </div>
                    ) : (
                      <p className="text-gray-700 leading-relaxed">
                        {profileData.bio}
                      </p>
                    )}
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-3">
                    {isEditing ? (
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              id="location"
                              className="pl-10"
                              value={profileData.location}
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  location: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              id="email"
                              type="email"
                              className="pl-10"
                              value={profileData.email}
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  email: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              id="phone"
                              className="pl-10"
                              value={profileData.phone}
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  phone: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="website">Website</Label>
                          <div className="relative">
                            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              id="website"
                              className="pl-10"
                              value={profileData.website}
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  website: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{profileData.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span>{profileData.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{profileData.phone}</span>
                        </div>
                        {profileData.website && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Globe className="w-4 h-4" />
                            <a
                              href={profileData.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-bizzleap-primary hover:underline"
                            >
                              {profileData.website}
                            </a>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Joined{" "}
                            {stats.joinDate.toLocaleDateString("en-US", {
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <div className="flex gap-2">
                      <Button onClick={handleSaveProfile} className="flex-1">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Business Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Business Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      icon: Eye,
                      value: stats.totalViews,
                      label: "Profile Views",
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
                      icon: Package,
                      value: stats.products,
                      label: "Products",
                      color: "text-bizzleap-primary",
                      bgColor: "bg-bizzleap-light",
                    },
                    {
                      icon: Star,
                      value: stats.avgRating.toFixed(1),
                      label: "Avg Rating",
                      color: "text-yellow-600",
                      bgColor: "bg-yellow-50",
                    },
                  ].map((metric, index) => (
                    <div
                      key={index}
                      className="text-center p-4 rounded-lg border bg-white"
                    >
                      <div
                        className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${metric.bgColor} mb-2`}
                      >
                        <metric.icon className={`w-6 h-6 ${metric.color}`} />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {metric.value}
                      </p>
                      <p className="text-sm text-gray-600">{metric.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
                    >
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full ${achievement.bgColor}`}
                      >
                        <achievement.icon
                          className={`w-5 h-5 ${achievement.color}`}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {achievement.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            {/* Review Overview */}
            <Card>
              <CardContent className="p-6 text-center">
                <div className="space-y-4">
                  <div>
                    <p className="text-4xl font-bold text-gray-900">
                      {stats.avgRating.toFixed(1)}
                    </p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      {renderStars(Math.floor(stats.avgRating))}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Based on {reviews.length} reviews
                    </p>
                  </div>

                  {/* Rating Distribution */}
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = reviews.filter(
                        (r) => r.rating === rating,
                      ).length;
                      const percentage =
                        reviews.length > 0 ? (count / reviews.length) * 100 : 0;

                      return (
                        <div
                          key={rating}
                          className="flex items-center gap-3 text-sm"
                        >
                          <span className="text-gray-600 w-8">{rating}★</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-gray-600 w-8">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Customer Reviews
              </h3>
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage
                            src={review.reviewer.avatar}
                            alt={review.reviewer.name}
                          />
                          <AvatarFallback>
                            {review.reviewer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {review.reviewer.name}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {review.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>

                      <p className="text-gray-700 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    id: "emailNotifications",
                    title: "Email Notifications",
                    description: "Receive notifications via email",
                  },
                  {
                    id: "pushNotifications",
                    title: "Push Notifications",
                    description: "Receive push notifications on your device",
                  },
                  {
                    id: "marketingEmails",
                    title: "Marketing Emails",
                    description: "Receive promotional emails and updates",
                  },
                ].map((setting) => (
                  <div
                    key={setting.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {setting.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        {setting.description}
                      </p>
                    </div>
                    <Switch
                      checked={
                        settings[setting.id as keyof typeof settings] as boolean
                      }
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, [setting.id]: checked })
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    id: "profileVisibility",
                    title: "Public Profile",
                    description: "Make your profile visible to other users",
                  },
                  {
                    id: "showContact",
                    title: "Show Contact Information",
                    description: "Display your contact details on your profile",
                  },
                ].map((setting) => (
                  <div
                    key={setting.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {setting.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        {setting.description}
                      </p>
                    </div>
                    <Switch
                      checked={
                        settings[setting.id as keyof typeof settings] as boolean
                      }
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, [setting.id]: checked })
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() =>
                    toast({
                      title: "Coming soon!",
                      description: "This feature is in development.",
                    })
                  }
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() =>
                    toast({
                      title: "Coming soon!",
                      description: "This feature is in development.",
                    })
                  }
                >
                  <Users className="w-4 h-4 mr-2" />
                  Privacy Policy
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() =>
                    toast({
                      title: "Coming soon!",
                      description: "This feature is in development.",
                    })
                  }
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Terms of Service
                </Button>
                <Button
                  variant="destructive"
                  className="w-full justify-start"
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
