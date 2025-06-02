import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  User,
  MessageCircle,
  TrendingUp,
  Star,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className }) => {
  const location = useLocation();

  const navItems = [
    {
      path: "/dashboard",
      icon: Home,
      label: "Home",
      isActive: location.pathname === "/dashboard",
    },
    {
      path: "/social-campaigns",
      icon: TrendingUp,
      label: "Campaign",
      isActive: location.pathname === "/social-campaigns",
    },
    {
      path: "/add-product",
      icon: Plus,
      label: "Add",
      isActive: location.pathname === "/add-product",
      isSpecial: true,
    },
    {
      path: "/chat",
      icon: MessageCircle,
      label: "Chat",
      isActive: location.pathname === "/chat",
    },
    {
      path: "/profile",
      icon: User,
      label: "Profile",
      isActive: location.pathname === "/profile",
    },
  ];

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50",
        "safe-area-inset-bottom",
        className,
      )}
    >
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {navItems.map(({ path, icon: Icon, label, isActive, isSpecial }) => (
          <Link
            key={path}
            to={path}
            className={cn(
              "flex flex-col items-center justify-center p-2 rounded-lg transition-colors",
              "min-w-[48px] min-h-[48px]",
              isActive && !isSpecial && "text-green-600",
              !isActive && !isSpecial && "text-gray-600",
              isSpecial && "relative",
            )}
          >
            {isSpecial ? (
              <Button
                size="sm"
                className={cn(
                  "w-12 h-12 rounded-full bg-green-600 hover:bg-green-700",
                  "flex items-center justify-center shadow-lg",
                  isActive && "bg-green-700",
                )}
              >
                <Icon className="w-6 h-6 text-white" />
              </Button>
            ) : (
              <>
                <Icon
                  className={cn(
                    "w-6 h-6 mb-1",
                    isActive ? "text-green-600" : "text-gray-500",
                  )}
                />
                <span
                  className={cn(
                    "text-xs font-medium",
                    isActive ? "text-green-600" : "text-gray-500",
                  )}
                >
                  {label}
                </span>
              </>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
