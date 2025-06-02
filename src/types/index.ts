export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  role: "farmer" | "business_owner" | "buyer";
  bio?: string;
  location: string;
  businessType?: string;
  avatar?: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  userId: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  inStock: boolean;
  views: number;
  inquiries: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  fromUserId: string;
  toUserId: string;
  productId?: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  read: boolean;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: Date;
}

export interface SocialPost {
  id: string;
  userId: string;
  content: string;
  platforms: ("facebook" | "instagram" | "twitter" | "whatsapp")[];
  scheduledDate?: Date;
  status: "draft" | "scheduled" | "published";
  metrics?: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
  };
  createdAt: Date;
}

export interface Campaign {
  id: string;
  userId: string;
  title: string;
  description: string;
  posts: SocialPost[];
  status: "active" | "paused" | "completed";
  startDate: Date;
  endDate?: Date;
}

export interface AppFeedback {
  id: string;
  userId: string;
  type: "bug" | "feature" | "general";
  title: string;
  description: string;
  rating?: number;
  status: "pending" | "in_review" | "resolved";
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AppContextType {
  user: User | null;
  products: Product[];
  conversations: Conversation[];
  reviews: Review[];
  campaigns: Campaign[];
  setUser: (user: User | null) => void;
  addProduct: (
    product: Omit<Product, "id" | "createdAt" | "updatedAt">,
  ) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
}
