
import { 
  User, 
  Item, 
  Swap, 
  Transaction, 
  RegisterRequest, 
  LoginRequest, 
  AuthResponse,
  CreateItemRequest,
  UpdateItemRequest,
  SwapRequest,
  RedeemRequest,
  RedeemResponse,
  UpdateProfileRequest,
  DashboardData,
  AdminStats,
  Order,
  UploadResponse,
  ApiError
} from '@/types/api';

const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({ 
        message: `HTTP ${response.status}: ${response.statusText}` 
      }));
      throw new Error(error.message);
    }
    return response.json();
  }

  // Authentication
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await this.handleResponse<AuthResponse>(response);
    if (result.token) {
      localStorage.setItem('auth_token', result.token);
    }
    return result;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await this.handleResponse<AuthResponse>(response);
    if (result.token) {
      localStorage.setItem('auth_token', result.token);
    }
    return result;
  }

  async getMe(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<User>(response);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
  }

  // Users
  async getUser(id: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<User>(response);
  }

  async getDashboard(): Promise<DashboardData> {
    const response = await fetch(`${API_BASE_URL}/users/me/dashboard`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<DashboardData>(response);
  }

  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return this.handleResponse<User>(response);
  }

  // Items
  async getItems(filters?: {
    category?: string;
    size?: string;
    condition?: string;
    tags?: string[];
  }): Promise<Item[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.size) params.append('size', filters.size);
    if (filters?.condition) params.append('condition', filters.condition);
    if (filters?.tags) filters.tags.forEach(tag => params.append('tags', tag));
    
    const response = await fetch(`${API_BASE_URL}/items?${params.toString()}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<Item[]>(response);
  }

  async getItem(id: string): Promise<Item> {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<Item>(response);
  }

  async createItem(data: CreateItemRequest): Promise<Item> {
    const response = await fetch(`${API_BASE_URL}/items`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return this.handleResponse<Item>(response);
  }

  async updateItem(id: string, data: UpdateItemRequest): Promise<Item> {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return this.handleResponse<Item>(response);
  }

  async deleteItem(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    await this.handleResponse<void>(response);
  }

  // Swaps
  async requestSwap(data: SwapRequest): Promise<Swap> {
    const response = await fetch(`${API_BASE_URL}/swaps/request`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return this.handleResponse<Swap>(response);
  }

  async acceptSwap(id: string): Promise<Swap> {
    const response = await fetch(`${API_BASE_URL}/swaps/${id}/accept`, {
      method: 'PATCH',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<Swap>(response);
  }

  async rejectSwap(id: string): Promise<Swap> {
    const response = await fetch(`${API_BASE_URL}/swaps/${id}/reject`, {
      method: 'PATCH',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<Swap>(response);
  }

  async completeSwap(id: string): Promise<Swap> {
    const response = await fetch(`${API_BASE_URL}/swaps/${id}/complete`, {
      method: 'PATCH',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<Swap>(response);
  }

  async getMySwaps(): Promise<Swap[]> {
    const response = await fetch(`${API_BASE_URL}/swaps/me`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<Swap[]>(response);
  }

  async getAllSwaps(): Promise<Swap[]> {
    const response = await fetch(`${API_BASE_URL}/admin/swaps`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<Swap[]>(response);
  }

  // Redemptions
  async redeemItem(data: RedeemRequest): Promise<RedeemResponse> {
    const response = await fetch(`${API_BASE_URL}/redemptions`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return this.handleResponse<RedeemResponse>(response);
  }

  async getRedemptionHistory(): Promise<Transaction[]> {
    const response = await fetch(`${API_BASE_URL}/redemptions/history`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<Transaction[]>(response);
  }

  async getAllTransactions(): Promise<Transaction[]> {
    const response = await fetch(`${API_BASE_URL}/admin/transactions`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<Transaction[]>(response);
  }

  // Orders
  async getMyOrders(): Promise<Order[]> {
    const response = await fetch(`${API_BASE_URL}/orders/me`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<Order[]>(response);
  }

  async getAllOrders(): Promise<Order[]> {
    const response = await fetch(`${API_BASE_URL}/admin/orders`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<Order[]>(response);
  }

  async getOrder(id: string): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<Order>(response);
  }

  async cancelOrder(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/cancel`, {
      method: 'PATCH',
      headers: this.getAuthHeaders()
    });
    await this.handleResponse<void>(response);
  }

  // Admin
  async getPendingItems(): Promise<Item[]> {
    const response = await fetch(`${API_BASE_URL}/admin/items/pending`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<Item[]>(response);
  }

  async approveItem(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/admin/items/${id}/approve`, {
      method: 'PATCH',
      headers: this.getAuthHeaders()
    });
    await this.handleResponse<void>(response);
  }

  async rejectItem(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/admin/items/${id}/reject`, {
      method: 'PATCH',
      headers: this.getAuthHeaders()
    });
    await this.handleResponse<void>(response);
  }

  async deleteItemAdmin(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/admin/items/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    await this.handleResponse<void>(response);
  }

  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<User[]>(response);
  }

  async banUser(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}/ban`, {
      method: 'PATCH',
      headers: this.getAuthHeaders()
    });
    await this.handleResponse<void>(response);
  }

  async getAdminDashboard(): Promise<AdminStats> {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<AdminStats>(response);
  }

  // File Upload
  async uploadImage(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('image', file);
    
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: formData
    });
    return this.handleResponse<UploadResponse>(response);
  }
}

export const apiService = new ApiService();
