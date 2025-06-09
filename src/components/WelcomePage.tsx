import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sprout,
  ArrowRight,
  Eye,
  MessageCircle,
  Star,
  TrendingUp,
  Users,
  BarChart3,
  Smartphone,
  Leaf,
  CheckCircle,
} from "lucide-react";

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Sprout,
      title: "For Farmers",
      description:
        "Showcase your fresh produce and connect directly with buyers",
      color: "text-bizzleap-primary",
      bgColor: "bg-bizzleap-light",
    },
    {
      icon: TrendingUp,
      title: "Grow Your Business",
      description: "Market your products and services to a wider audience",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: MessageCircle,
      title: "Direct Communication",
      description:
        "Chat directly with customers and build lasting relationships",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: Star,
      title: "Build Your Reputation",
      description: "Collect reviews and showcase your quality work",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
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

  const stats = [
    { icon: Users, text: "1000+ Users" },
    { icon: Star, text: "4.8 Rating" },
    { icon: BarChart3, text: "Growing Fast" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-bizzleap-light via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6 text-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-bizzleap-primary/5 to-blue-600/5" />

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex items-center justify-center bg-bizzleap-primary w-10 h-10 rounded-full">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Bizzleap
              </h1>
            </div>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Empowering farmers and small businesses to grow, connect, and
              thrive in the digital marketplace
            </p>

            <Badge className="mt-4 bg-bizzleap-light text-bizzleap-secondary border-bizzleap-primary/20">
              <Smartphone className="w-4 h-4 mr-2" />
              Mobile Optimized
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 space-y-16">
        {/* Hero CTA */}
        <section className="text-center space-y-6">
          <div className="space-y-4">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-bizzleap-primary hover:bg-bizzleap-secondary text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/auth")}
                className="text-bizzleap-primary font-semibold hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Built for Your Success
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to showcase your products and connect with
              customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-1"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${feature.bgColor} mb-4 group-hover:scale-110 transition-transform duration-200`}
                  >
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Everything You Need
            </h2>
            <p className="text-gray-600">
              Comprehensive tools to manage and grow your business
            </p>
          </div>

          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                  >
                    <CheckCircle className="w-5 h-5 text-bizzleap-primary flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Social Proof */}
        <section className="text-center space-y-6">
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-gray-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full"
              >
                <stat.icon className="w-5 h-5 text-bizzleap-primary" />
                <span className="font-medium">{stat.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center space-y-6 py-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">
              Ready to grow your business?
            </h3>
            <p className="text-gray-600 max-w-xl mx-auto">
              Join thousands of farmers and small business owners who are
              already growing their businesses with Bizzleap.
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="bg-bizzleap-primary hover:bg-bizzleap-secondary text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          >
            <span>Join Bizzleap Today</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex items-center justify-center bg-bizzleap-primary w-8 h-8 rounded-full">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Bizzleap</span>
          </div>
          <p className="text-gray-400 text-sm">
            Empowering agriculture and small business growth
          </p>
          <div className="mt-4 flex items-center justify-center gap-1">
            <Leaf className="w-4 h-4 text-bizzleap-accent" />
            <span className="text-sm text-gray-400">
              Supporting sustainable farming practices
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;
