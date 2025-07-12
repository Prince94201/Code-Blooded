
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { 
  RegisterRequest, 
  LoginRequest, 
  CreateItemRequest, 
  UpdateItemRequest,
  SwapRequest,
  RedeemRequest,
  UpdateProfileRequest
} from '@/types/api';

// Auth hooks
export const useLogin = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: LoginRequest) => apiService.login(data),
    onSuccess: () => {
      toast({ title: "Success", description: "Logged in successfully!" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Login Failed", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });
};

export const useRegister = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: RegisterRequest) => apiService.register(data),
    onSuccess: () => {
      toast({ title: "Success", description: "Account created successfully!" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Registration Failed", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });
};

export const useUser = () => {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => apiService.getMe(),
    retry: false
  });
};

// Dashboard hook
export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => apiService.getDashboard(),
    enabled: !!localStorage.getItem('auth_token')
  });
};

// Items hooks
export const useItems = (filters?: {
  category?: string;
  size?: string;
  condition?: string;
  tags?: string[];
}) => {
  return useQuery({
    queryKey: ['items', filters],
    queryFn: () => apiService.getItems(filters)
  });
};

export const useItem = (id: string) => {
  return useQuery({
    queryKey: ['items', id],
    queryFn: () => apiService.getItem(id),
    enabled: !!id
  });
};

export const useCreateItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: CreateItemRequest) => apiService.createItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast({ title: "Success", description: "Item listed successfully!" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to create item", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateItemRequest }) => 
      apiService.updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast({ title: "Success", description: "Item updated successfully!" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to update item", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (id: string) => apiService.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast({ title: "Success", description: "Item deleted successfully!" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to delete item", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });
};

// Swap hooks
export const useSwaps = () => {
  return useQuery({
    queryKey: ['swaps', 'me'],
    queryFn: () => apiService.getMySwaps(),
    enabled: !!localStorage.getItem('auth_token')
  });
};

export const useRequestSwap = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: SwapRequest) => apiService.requestSwap(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['swaps'] });
      toast({ title: "Success", description: "Swap request sent!" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to request swap", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });
};

// Redemption hooks
export const useRedeemItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: RedeemRequest) => apiService.redeemItem(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast({ 
        title: "Success", 
        description: `Item redeemed for ${data.pointsDeducted} points!` 
      });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Redemption failed", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });
};

export const useRedemptionHistory = () => {
  return useQuery({
    queryKey: ['redemptions', 'history'],
    queryFn: () => apiService.getRedemptionHistory(),
    enabled: !!localStorage.getItem('auth_token')
  });
};

// Profile update hook
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => apiService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast({ title: "Success", description: "Profile updated successfully!" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to update profile", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });
};

// Admin hooks  
export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => apiService.getAdminDashboard(),
    enabled: !!localStorage.getItem('auth_token')
  });
};

export const usePendingItems = () => {
  return useQuery({
    queryKey: ['admin', 'items', 'pending'],
    queryFn: () => apiService.getPendingItems(),
    enabled: !!localStorage.getItem('auth_token')
  });
};

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => apiService.getUsers(),
    enabled: !!localStorage.getItem('auth_token')
  });
};

// File upload hook
export const useUploadImage = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (file: File) => apiService.uploadImage(file),
    onError: (error: Error) => {
      toast({ 
        title: "Upload failed", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });
};
