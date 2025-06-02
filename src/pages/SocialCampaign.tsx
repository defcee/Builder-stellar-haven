import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Plus,
  TrendingUp,
  Calendar as CalendarIcon,
  Facebook,
  Instagram,
  Twitter,
  MessageSquare,
  Eye,
  Heart,
  Share2,
  BarChart3,
  Clock,
  Send,
  Edit3,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const SocialCampaign: React.FC = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({
    content: "",
    platforms: [] as string[],
    scheduledDate: undefined as Date | undefined,
  });

  const socialPlatforms = [
    {
      id: "facebook",
      name: "Facebook",
      icon: Facebook,
      color: "text-blue-600",
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: Instagram,
      color: "text-pink-600",
    },
    { id: "twitter", name: "Twitter", icon: Twitter, color: "text-blue-400" },
    {
      id: "whatsapp",
      name: "WhatsApp",
      icon: MessageSquare,
      color: "text-green-600",
    },
  ];

  // Mock campaigns and posts data
  const mockCampaigns = [
    {
      id: "1",
      title: "Fresh Harvest Promotion",
      description: "Promoting our latest organic vegetable harvest",
      status: "active" as const,
      posts: 5,
      reach: 1240,
      engagement: 89,
      startDate: new Date(Date.now() - 604800000), // 1 week ago
    },
    {
      id: "2",
      title: "Summer Sale Campaign",
      description: "Special discounts on all seasonal produce",
      status: "scheduled" as const,
      posts: 3,
      reach: 0,
      engagement: 0,
      startDate: new Date(Date.now() + 86400000), // Tomorrow
    },
  ];

  const mockPosts = [
    {
      id: "1",
      content:
        "Fresh organic tomatoes just harvested! 🍅 Get them while they're still warm from the vine. Perfect for your summer salads! #OrganicFarming #FreshProduce",
      platforms: ["facebook", "instagram"],
      status: "published" as const,
      metrics: { views: 456, likes: 23, shares: 8, comments: 5 },
      createdAt: new Date(Date.now() - 86400000),
    },
    {
      id: "2",
      content:
        "Starting the day early in the fields 🌅 There's nothing quite like the morning dew on fresh vegetables. What's your favorite way to enjoy farm-fresh produce?",
      platforms: ["instagram", "twitter"],
      status: "published" as const,
      metrics: { views: 234, likes: 18, shares: 3, comments: 7 },
      createdAt: new Date(Date.now() - 172800000),
    },
    {
      id: "3",
      content:
        "Weekend special: 20% off all leafy greens! 🥬 Perfect timing for your Sunday meal prep. Fresh spinach, lettuce, and kale available.",
      platforms: ["facebook", "whatsapp"],
      status: "scheduled" as const,
      scheduledDate: new Date(Date.now() + 86400000),
      metrics: { views: 0, likes: 0, shares: 0, comments: 0 },
      createdAt: new Date(),
    },
  ];

  const handlePlatformToggle = (platformId: string) => {
    setNewPost((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter((p) => p !== platformId)
        : [...prev.platforms, platformId],
    }));
  };

  const handleCreatePost = () => {
    // In a real app, this would save to backend
    console.log("Creating post:", newPost);
    setNewPost({ content: "", platforms: [], scheduledDate: undefined });
    setShowCreateForm(false);
  };

  const templates = [
    "🌱 Fresh [Product] now available! Get yours today and taste the difference quality makes. #FreshProduce #LocalFarm",
    "🌅 Good morning! Starting the day with fresh [Product] from our farm. What's on your plate today? #MorningHarvest",
    "🥗 Weekend special: [Discount]% off [Product]! Perfect for your meal prep. Limited time offer! #WeekendDeal",
    "📸 Behind the scenes: Watch how we grow your favorite [Product] with care and dedication. #FarmLife #Organic",
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Social Campaigns
              </h1>
              <p className="text-sm text-gray-600">
                Promote your products on social media
              </p>
            </div>
            <Button size="sm" onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </Button>
          </div>
        </div>
      </header>

      <main className="px-4 py-6">
        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-6">
            {/* Create Post Form */}
            {showCreateForm && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Create New Post</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="content">Post Content</Label>
                    <Textarea
                      id="content"
                      placeholder="What would you like to share about your products?"
                      value={newPost.content}
                      onChange={(e) =>
                        setNewPost((prev) => ({
                          ...prev,
                          content: e.target.value,
                        }))
                      }
                      rows={4}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Select Platforms</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {socialPlatforms.map((platform) => (
                        <div
                          key={platform.id}
                          className={cn(
                            "flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors",
                            newPost.platforms.includes(platform.id)
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200 hover:border-gray-300",
                          )}
                          onClick={() => handlePlatformToggle(platform.id)}
                        >
                          <Checkbox
                            checked={newPost.platforms.includes(platform.id)}
                            onChange={() => handlePlatformToggle(platform.id)}
                          />
                          <platform.icon
                            className={`w-5 h-5 ${platform.color}`}
                          />
                          <span className="text-sm font-medium">
                            {platform.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Schedule Post (Optional)</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !newPost.scheduledDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newPost.scheduledDate
                            ? format(newPost.scheduledDate, "PPP")
                            : "Post now"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={newPost.scheduledDate}
                          onSelect={(date) =>
                            setNewPost((prev) => ({
                              ...prev,
                              scheduledDate: date,
                            }))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleCreatePost} className="flex-1">
                      {newPost.scheduledDate ? (
                        <>
                          <Clock className="w-4 h-4 mr-2" />
                          Schedule Post
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Publish Now
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Content Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Content Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {templates.map((template, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() =>
                      setNewPost((prev) => ({ ...prev, content: template }))
                    }
                  >
                    <p className="text-sm text-gray-700">{template}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Posts */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Posts
              </h3>
              {mockPosts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <p className="text-sm text-gray-900 flex-1">
                          {post.content}
                        </p>
                        <Button variant="ghost" size="sm">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        {post.platforms.map((platformId) => {
                          const platform = socialPlatforms.find(
                            (p) => p.id === platformId,
                          );
                          return platform ? (
                            <Badge
                              key={platformId}
                              variant="outline"
                              className="text-xs"
                            >
                              <platform.icon
                                className={`w-3 h-3 mr-1 ${platform.color}`}
                              />
                              {platform.name}
                            </Badge>
                          ) : null;
                        })}
                        <Badge
                          variant={
                            post.status === "published"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {post.status}
                        </Badge>
                      </div>

                      {post.status === "published" && (
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{post.metrics.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            <span>{post.metrics.likes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Share2 className="w-4 h-4" />
                            <span>{post.metrics.shares}</span>
                          </div>
                        </div>
                      )}

                      {post.scheduledDate && (
                        <p className="text-xs text-gray-500">
                          Scheduled for {format(post.scheduledDate, "PPP")}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Your Campaigns
              </h3>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Campaign
              </Button>
            </div>

            {mockCampaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {campaign.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {campaign.description}
                        </p>
                      </div>
                      <Badge
                        variant={
                          campaign.status === "active" ? "default" : "secondary"
                        }
                      >
                        {campaign.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-lg font-bold text-gray-900">
                          {campaign.posts}
                        </p>
                        <p className="text-xs text-gray-600">Posts</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">
                          {campaign.reach}
                        </p>
                        <p className="text-xs text-gray-600">Reach</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">
                          {campaign.engagement}
                        </p>
                        <p className="text-xs text-gray-600">Engagement</p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500">
                      Started {format(campaign.startDate, "PPP")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-blue-50 rounded-full">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">2.4K</p>
                  <p className="text-sm text-gray-600">Total Reach</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-green-50 rounded-full">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">156</p>
                  <p className="text-sm text-gray-600">Engagement</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-purple-50 rounded-full">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">6.5%</p>
                  <p className="text-sm text-gray-600">Engagement Rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-yellow-50 rounded-full">
                    <Share2 className="w-6 h-6 text-yellow-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">42</p>
                  <p className="text-sm text-gray-600">Shares</p>
                </CardContent>
              </Card>
            </div>

            {/* Platform Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Platform Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {socialPlatforms.map((platform, index) => {
                  const performance = [85, 72, 63, 91][index]; // Mock data
                  return (
                    <div key={platform.id} className="flex items-center gap-3">
                      <platform.icon className={`w-5 h-5 ${platform.color}`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">
                            {platform.name}
                          </span>
                          <span className="text-sm text-gray-600">
                            {performance}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${performance}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Navigation />
    </div>
  );
};

export default SocialCampaign;
