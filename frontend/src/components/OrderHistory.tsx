import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, ArrowRightLeft, X, Package } from "lucide-react";
import { apiService } from '@/services/api';
import { Order, Swap, Transaction } from '@/types/api';
import { useToast } from "@/hooks/use-toast";

interface OrderHistoryProps {
  onOrderUpdate?: () => void;
}

const OrderHistory = ({ onOrderUpdate }: OrderHistoryProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userOrders = await apiService.getMyOrders();
        setOrders(userOrders);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load orders",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [toast]);

  const handleCancelOrder = async (orderId: string) => {
    try {
      await apiService.cancelOrder(orderId);
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: 'cancelled' } : order
      ));
      toast({
        title: "Order Cancelled",
        description: "The order has been cancelled.",
      });
      onOrderUpdate?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel order",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderIcon = (type: string) => {
    switch (type) {
      case 'swap':
        return <ArrowRightLeft className="text-blue-500" size={20} />;
      case 'redemption':
        return <Package className="text-green-500" size={20} />;
      default:
        return <ShoppingBag className="text-gray-500" size={20} />;
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="text-purple-500" size={20} />
            Order History
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
          <ShoppingBag className="text-purple-500" size={20} />
          Order History ({orders.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ShoppingBag size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No orders yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getOrderIcon(order.type)}
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {order.type === 'swap' ? 'Swap Request' : 'Item Redemption'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Order #{order.id.slice(-6)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {order.createdAt 
                        ? new Date(order.createdAt).toLocaleDateString()
                        : 'Unknown date'
                      }
                    </span>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        {order.type === 'swap' ? 'Swap details' : 'Redemption details'}
                      </p>
                      <p className="text-sm font-medium">
                        {order.type === 'swap' 
                          ? `${(order.details as Swap)?.itemOffered?.title} ↔ ${(order.details as Swap)?.itemRequested?.title}`
                          : `${(order.details as Transaction)?.item?.title} - ${(order.details as Transaction)?.pointsUsed} points`
                        }
                      </p>
                    </div>
                    
                    {order.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancelOrder(order.id)}
                        className="flex items-center gap-1 text-red-600 hover:bg-red-50"
                      >
                        <X size={16} />
                        Cancel
                      </Button>
                    )}
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

export default OrderHistory;
