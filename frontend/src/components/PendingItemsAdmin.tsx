import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Eye, Clock } from "lucide-react";
import { apiService } from '@/services/api';
import { Item } from '@/types/api';
import { useToast } from "@/hooks/use-toast";

interface PendingItemsAdminProps {
  onItemUpdate?: () => void;
}

const PendingItemsAdmin = ({ onItemUpdate }: PendingItemsAdminProps) => {
  const [pendingItems, setPendingItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPendingItems = async () => {
      try {
        const items = await apiService.getPendingItems();
        setPendingItems(items);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load pending items",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPendingItems();
  }, [toast]);

  const handleApprove = async (itemId: string) => {
    try {
      await apiService.approveItem(itemId);
      setPendingItems(prev => prev.filter(item => item.id !== itemId));
      toast({
        title: "Item Approved",
        description: "The item has been approved and is now available.",
      });
      onItemUpdate?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve item",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (itemId: string) => {
    try {
      await apiService.rejectItem(itemId);
      setPendingItems(prev => prev.filter(item => item.id !== itemId));
      toast({
        title: "Item Rejected",
        description: "The item has been rejected.",
      });
      onItemUpdate?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject item",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      await apiService.deleteItemAdmin(itemId);
      setPendingItems(prev => prev.filter(item => item.id !== itemId));
      toast({
        title: "Item Deleted",
        description: "The item has been permanently deleted.",
      });
      onItemUpdate?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="text-orange-500" size={20} />
            Pending Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="text-orange-500" size={20} />
          Pending Items ({pendingItems.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pendingItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No pending items to review</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingItems.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={item.images[0] || "/placeholder.svg"}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800 truncate">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.description}
                        </p>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className="bg-orange-100 text-orange-800"
                      >
                        Pending
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline">{item.category}</Badge>
                      <Badge variant="outline">{item.size}</Badge>
                      <Badge variant="outline">{item.condition}</Badge>
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <span>Owner: {item.owner?.name || 'Unknown'}</span>
                      <span>•</span>
                      <span>
                        {item.createdAt 
                          ? new Date(item.createdAt).toLocaleDateString()
                          : 'Unknown date'
                        }
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApprove(item.id)}
                        className="flex items-center gap-1 text-green-600 hover:bg-green-50"
                      >
                        <Check size={16} />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(item.id)}
                        className="flex items-center gap-1 text-red-600 hover:bg-red-50"
                      >
                        <X size={16} />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(item.id)}
                        className="flex items-center gap-1 text-red-600 hover:bg-red-50"
                      >
                        <X size={16} />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingItemsAdmin;
