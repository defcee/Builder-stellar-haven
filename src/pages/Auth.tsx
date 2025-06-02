import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthForm from "@/components/AuthForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Leaf } from "lucide-react";
import { Link } from "react-router-dom";

const Auth: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="relative bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">Bizzleap</span>
          </div>
          <div className="w-16"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <AuthForm
            onSuccess={() => {
              // Navigation will be handled by the Navigate component above
              // since isAuthenticated will become true
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default Auth;
