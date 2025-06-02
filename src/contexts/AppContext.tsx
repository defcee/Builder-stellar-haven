import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  Product,
  Conversation,
  Review,
  Campaign,
  AppContextType,
} from "@/types";
import { useAuth } from "./AuthContext";

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  // Mock data initialization
  useEffect(() => {
    if (user) {
      // Initialize mock products for the user
      const mockProducts: Product[] = [
        {
          id: "1",
          userId: user.id,
          title: "Fresh Organic Tomatoes",
          description:
            "Premium quality organic tomatoes grown without pesticides. Perfect for salads and cooking.",
          price: 5.99,
          images: ["/placeholder.svg"],
          category: "Vegetables",
          inStock: true,
          views: 45,
          inquiries: 8,
          createdAt: new Date(Date.now() - 86400000),
          updatedAt: new Date(),
        },
        {
          id: "2",
          userId: user.id,
          title: "Farm Fresh Chicken Eggs",
          description:
            "Free-range chicken eggs from happy, healthy chickens. Rich in nutrients and flavor.",
          price: 3.49,
          images: ["/placeholder.svg"],
          category: "Dairy & Eggs",
          inStock: true,
          views: 32,
          inquiries: 5,
          createdAt: new Date(Date.now() - 172800000),
          updatedAt: new Date(),
        },
      ];
      setProducts(mockProducts);
    }
  }, [user]);

  const addProduct = (
    productData: Omit<Product, "id" | "createdAt" | "updatedAt">,
  ) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, ...updates, updatedAt: new Date() }
          : product,
      ),
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
  };

  const value: AppContextType = {
    user,
    products,
    conversations,
    reviews,
    campaigns,
    setUser: () => {}, // This will be handled by AuthContext
    addProduct,
    updateProduct,
    deleteProduct,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
