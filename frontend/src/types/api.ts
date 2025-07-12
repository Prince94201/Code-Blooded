
// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  profileImageUrl?: string;
  points: number;
  role: 'user' | 'admin' | 'banned';
  createdAt: string;
}

// Item Types
export interface Item {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: 'Men' | 'Women' | 'Kids';
  size: 'S' | 'M' | 'L' | 'XL';
  condition: 'New' | 'Like New' | 'Used';
  tags: string[];
  status: 'pending' | 'available' | 'swapped' | 'reserved' | 'rejected';
  ownerId: string;
  owner?: {
    id: string;
    name: string;
  };
  createdAt?: string;
}

// Swap Types
export interface Swap {
  id: string;
  itemOfferedId: string;
  itemRequestedId: string;
  initiatorId: string;
  responderId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt?: string;
  itemOffered?: Item;
  itemRequested?: Item;
  initiator?: User;
  responder?: User;
}

// Transaction Types
export interface Transaction {
  id: string;
  userId: string;
  itemId: string | {
    _id: string;
    title: string;
    category: string;
    images: string[];
  };
  pointsUsed: number;
  type: 'earn' | 'redeem';
  createdAt: string;
  item?: {
    title: string;
    category: string;
    images: string[];
  };
}

// Auth Request/Response Types
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message?: string;
  token: string;
}

// Item Request Types
export interface CreateItemRequest {
  title: string;
  description: string;
  images: string[];
  category: 'Men' | 'Women' | 'Kids';
  size: 'S' | 'M' | 'L' | 'XL';
  condition: 'New' | 'Like New' | 'Used';
  tags: string[];
}

export interface UpdateItemRequest {
  title?: string;
  description?: string;
  images?: string[];
  category?: 'Men' | 'Women' | 'Kids';
  size?: 'S' | 'M' | 'L' | 'XL';
  condition?: 'New' | 'Like New' | 'Used';
  tags?: string[];
}

// Swap Request Types
export interface SwapRequest {
  itemOfferedId: string;
  itemRequestedId: string;
}

// Redemption Request Types
export interface RedeemRequest {
  itemId: string;
}

export interface RedeemResponse {
  message: string;
  pointsDeducted: number;
}

// Profile Update Types
export interface UpdateProfileRequest {
  name?: string;
  profileImageUrl?: string;
}

// Dashboard Response Types
export interface DashboardData {
  user: User;
  items: Item[];
  swaps: Swap[];
  transactions: Transaction[];
  stats: {
    activeListings: number;
    completedSwaps: number;
    totalPointsEarned: number;
    totalPointsSpent: number;
  };
}

// Admin Types
export interface AdminStats {
  users: number;
  items: {
    total: number;
    available: number;
    pending: number;
    swapped: number;
    rejected: number;
  };
  swaps: {
    total: number;
    pending: number;
    accepted: number;
    completed: number;
    rejected: number;
  };
  redemptions: {
    count: number;
    pointsUsed: number;
  };
}

// Order Types (unified type for orders)
export interface Order {
  id: string;
  type: 'swap' | 'redemption';
  status: string;
  createdAt: string;
  details?: Swap | Transaction;
}

// File Upload Types
export interface UploadResponse {
  url: string;
}

// API Error Type
export interface ApiError {
  message: string;
  code?: string;
}
