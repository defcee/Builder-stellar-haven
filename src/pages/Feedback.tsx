import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import ReviewCard from "@/components/ReviewCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  Star,
  MessageSquare,
  Send,
  TrendingUp,
  Users,
  CheckCircle,
  AlertCircle,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Bug,
  Lightbulb,
  MessageCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";

const feedbackSchema = z.object({
  type: z.enum(["bug", "feature", "general"]),
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  rating: z.number().min(1).max(5).optional(),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

const Feedback: React.FC = () => {
  const { user } = useAuth();
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      type: "general",
      title: "",
      description: "",
      rating: undefined,
    },
  });

  // Mock reviews data
  const mockReviews = [
    {
      id: "1",
      fromUserId: "2",
      toUserId: user?.id || "",
      rating: 5,
      comment:
        "Excellent quality produce! Always fresh and delivered on time. John is very professional and responsive to questions. Highly recommended for anyone looking for organic vegetables!",
      createdAt: new Date(Date.now() - 86400000),
    },
    {
      id: "2",
      fromUserId: "3",
      toUserId: user?.id || "",
      rating: 4,
      comment:
        "Great communication and fair prices. The tomatoes were delicious and lasted longer than store-bought ones. Will definitely order again next season.",
      createdAt: new Date(Date.now() - 172800000),
    },
    {
      id: "3",
      fromUserId: "4",
      toUserId: user?.id || "",
      rating: 5,
      comment:
        "Amazing organic vegetables! You can really taste the difference. John takes great care in growing his produce and it shows in the quality.",
      createdAt: new Date(Date.now() - 259200000),
    },
    {
      id: "4",
      fromUserId: "5",
      toUserId: user?.id || "",
      rating: 4,
      comment:
        "Fresh produce and quick delivery. Very satisfied with the service. The leafy greens stayed fresh for over a week.",
      createdAt: new Date(Date.now() - 345600000),
    },
  ];

  const mockReviewers = [
    { id: "2", name: "Sarah Johnson", avatar: "" },
    { id: "3", name: "Mike Chen", avatar: "" },
    { id: "4", name: "Emma Wilson", avatar: "" },
    { id: "5", name: "David Brown", avatar: "" },
  ];

  // Mock app feedback data
  const mockAppFeedback = [
    {
      id: "1",
      userId: user?.id || "",
      type: "feature" as const,
      title: "Add photo filters for product images",
      description:
        "It would be great to have built-in filters to enhance product photos before posting.",
      rating: 4,
      status: "in_review" as const,
      createdAt: new Date(Date.now() - 604800000),
    },
    {
      id: "2",
      userId: user?.id || "",
      type: "bug" as const,
      title: "Chat notifications not working",
      description:
        "Sometimes I don't receive notifications when customers send messages.",
      status: "resolved" as const,
      createdAt: new Date(Date.now() - 1209600000),
    },
  ];

  const avgRating =
    mockReviews.length > 0
      ? mockReviews.reduce((sum, review) => sum + review.rating, 0) /
        mockReviews.length
      : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: mockReviews.filter((review) => review.rating === rating).length,
    percentage:
      mockReviews.length > 0
        ? (mockReviews.filter((review) => review.rating === rating).length /
            mockReviews.length) *
          100
        : 0,
  }));

  const onSubmitFeedback = async (data: FeedbackFormData) => {
    try {
      // In a real app, this would submit to backend
      console.log("Submitting feedback:", data);
      toast({
        title: "Feedback submitted!",
        description:
          "Thank you for your feedback. We'll review it and get back to you soon.",
      });
      form.reset();
      setSelectedRating(0);
      setShowFeedbackForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    }
  };

  const feedbackTypeOptions = [
    {
      value: "bug",
      label: "Bug Report",
      icon: Bug,
      color: "text-red-600",
      description: "Report issues or problems with the app",
    },
    {
      value: "feature",
      label: "Feature Request",
      icon: Lightbulb,
      color: "text-blue-600",
      description: "Suggest new features or improvements",
    },
    {
      value: "general",
      label: "General Feedback",
      icon: MessageCircle,
      color: "text-green-600",
      description: "Share your thoughts about the app",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Reviews & Feedback
              </h1>
              <p className="text-sm text-gray-600">
                Customer reviews and app feedback
              </p>
            </div>
            <Dialog open={showFeedbackForm} onOpenChange={setShowFeedbackForm}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Give Feedback
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md mx-auto">
                <DialogHeader>
                  <DialogTitle>Share Your Feedback</DialogTitle>
                  <DialogDescription>
                    Help us improve Bizzleap by sharing your thoughts and
                    suggestions.
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={form.handleSubmit(onSubmitFeedback)}
                  className="space-y-4"
                >
                  <div className="space-y-3">
                    <Label>Feedback Type</Label>
                    <RadioGroup
                      value={form.watch("type")}
                      onValueChange={(value) =>
                        form.setValue("type", value as any)
                      }
                    >
                      {feedbackTypeOptions.map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center space-x-3"
                        >
                          <RadioGroupItem
                            value={option.value}
                            id={option.value}
                          />
                          <Label
                            htmlFor={option.value}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <option.icon
                              className={`w-4 h-4 ${option.color}`}
                            />
                            <div>
                              <p className="font-medium">{option.label}</p>
                              <p className="text-xs text-gray-500">
                                {option.description}
                              </p>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {form.formState.errors.type && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.type.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Brief description of your feedback"
                      {...form.register("title")}
                    />
                    {form.formState.errors.title && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.title.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Please provide more details..."
                      rows={4}
                      {...form.register("description")}
                    />
                    {form.formState.errors.description && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.description.message}
                      </p>
                    )}
                  </div>

                  {form.watch("type") === "general" && (
                    <div className="space-y-3">
                      <Label>Overall Rating (Optional)</Label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => {
                              setSelectedRating(rating);
                              form.setValue("rating", rating);
                            }}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                rating <=
                                (selectedRating || form.watch("rating") || 0)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      <Send className="w-4 h-4 mr-2" />
                      Submit Feedback
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowFeedbackForm(false)}
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
        <Tabs defaultValue="customer-reviews" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="customer-reviews">Customer Reviews</TabsTrigger>
            <TabsTrigger value="app-feedback">App Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="customer-reviews" className="space-y-6">
            {/* Review Overview */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div>
                    <p className="text-4xl font-bold text-gray-900">
                      {avgRating.toFixed(1)}
                    </p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= avgRating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Based on {mockReviews.length} reviews
                    </p>
                  </div>

                  {/* Rating Distribution */}
                  <div className="space-y-2">
                    {ratingDistribution.map(({ rating, count, percentage }) => (
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
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                All Reviews
              </h3>
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
            </div>
          </TabsContent>

          <TabsContent value="app-feedback" className="space-y-6">
            {/* Feedback Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 bg-blue-50 rounded-full">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-xl font-bold text-gray-900">
                    {mockAppFeedback.length}
                  </p>
                  <p className="text-xs text-gray-600">Total Feedback</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 bg-green-50 rounded-full">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-xl font-bold text-gray-900">
                    {
                      mockAppFeedback.filter((f) => f.status === "resolved")
                        .length
                    }
                  </p>
                  <p className="text-xs text-gray-600">Resolved</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 bg-yellow-50 rounded-full">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <p className="text-xl font-bold text-gray-900">
                    {
                      mockAppFeedback.filter((f) => f.status === "in_review")
                        .length
                    }
                  </p>
                  <p className="text-xs text-gray-600">In Review</p>
                </CardContent>
              </Card>
            </div>

            {/* Feedback List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Your Feedback
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowFeedbackForm(true)}
                >
                  Add Feedback
                </Button>
              </div>

              {mockAppFeedback.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="font-medium text-gray-900 mb-2">
                      No feedback submitted
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Help us improve Bizzleap by sharing your thoughts and
                      suggestions.
                    </p>
                    <Button onClick={() => setShowFeedbackForm(true)}>
                      Give Feedback
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {mockAppFeedback.map((feedback) => {
                    const typeOption = feedbackTypeOptions.find(
                      (opt) => opt.value === feedback.type,
                    );
                    return (
                      <Card key={feedback.id}>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                {typeOption && (
                                  <typeOption.icon
                                    className={`w-4 h-4 ${typeOption.color}`}
                                  />
                                )}
                                <h4 className="font-medium text-gray-900">
                                  {feedback.title}
                                </h4>
                              </div>
                              <Badge
                                variant={
                                  feedback.status === "resolved"
                                    ? "default"
                                    : feedback.status === "in_review"
                                      ? "secondary"
                                      : "outline"
                                }
                                className="text-xs"
                              >
                                {feedback.status.replace("_", " ")}
                              </Badge>
                            </div>

                            <p className="text-sm text-gray-600 leading-relaxed">
                              {feedback.description}
                            </p>

                            {feedback.rating && (
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= feedback.rating!
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                                <span className="text-sm text-gray-600 ml-2">
                                  {feedback.rating}/5
                                </span>
                              </div>
                            )}

                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>
                                Submitted{" "}
                                {feedback.createdAt.toLocaleDateString()}
                              </span>
                              {feedback.status === "resolved" && (
                                <div className="flex items-center gap-1 text-green-600">
                                  <CheckCircle className="w-3 h-3" />
                                  <span>Resolved</span>
                                </div>
                              )}
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
        </Tabs>
      </main>

      <Navigation />
    </div>
  );
};

export default Feedback;
