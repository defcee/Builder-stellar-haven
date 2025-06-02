import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Leaf,
  TrendingUp,
  Users,
  MessageCircle,
  Star,
  CheckCircle,
  ArrowRight,
  Smartphone,
} from "lucide-react";

const Welcome: React.FC = () => {
  const features = [
    {
      icon: Leaf,
      title: "For Farmers",
      description:
        "Showcase your fresh produce and connect directly with buyers",
      color: "text-green-600",
    },
    {
      icon: TrendingUp,
      title: "Grow Your Business",
      description: "Market your products and services to a wider audience",
      color: "text-blue-600",
    },
    {
      icon: MessageCircle,
      title: "Direct Communication",
      description:
        "Chat directly with customers and build lasting relationships",
      color: "text-purple-600",
    },
    {
      icon: Star,
      title: "Build Your Reputation",
      description: "Collect reviews and showcase your quality work",
      color: "text-yellow-600",
    },
  ];

  const benefits = [
    "Easy product listing and management",
    "Social media campaign tools",
    "Direct messaging with customers",
    "Review and rating system",
    "Mobile-first design",
    "Secure payment integration",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="relative overflow-hidden bg-white shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-blue-600/5" />
        <div className="relative px-6 py-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Bizzleap</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
            Empowering farmers and small businesses to grow, connect, and thrive
            in the digital marketplace
          </p>
          <Badge className="mt-4 bg-green-100 text-green-700 hover:bg-green-100">
            <Smartphone className="w-3 h-3 mr-1" />
            Mobile Optimized
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8 space-y-12">
        {/* Hero CTA */}
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <Button
              asChild
              size="lg"
              className="w-full max-w-xs bg-green-600 hover:bg-green-700"
            >
              <Link to="/auth">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to="/auth"
                className="text-green-600 font-medium hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-900">
            Built for Your Success
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-md hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6 text-center space-y-3">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 ${feature.color}`}
                  >
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Benefits List */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-900">
            Everything You Need
          </h2>
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="grid gap-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Social Proof */}
        <section className="text-center space-y-4">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>1000+ Users</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>4.8 Rating</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>Growing Fast</span>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center space-y-4 pb-8">
          <h3 className="text-xl font-semibold text-gray-900">
            Ready to grow your business?
          </h3>
          <Button
            asChild
            size="lg"
            className="w-full max-w-xs bg-green-600 hover:bg-green-700"
          >
            <Link to="/auth">
              Join Bizzleap Today
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </section>
      </main>
    </div>
  );
};

export default Welcome;
