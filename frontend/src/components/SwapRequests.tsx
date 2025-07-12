import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, ArrowRightLeft, Clock } from "lucide-react";
import { apiService } from '@/services/api';
import { Swap } from '@/types/api';
import { useToast } from "@/hooks/use-toast";

interface SwapRequestsProps {
  onSwapUpdate?: () => void;
}

const SwapRequests = ({ onSwapUpdate }: SwapRequestsProps) => {
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSwaps = async () => {
      try {
        const userSwaps = await apiService.getMySwaps();
        setSwaps(userSwaps);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load swap requests",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSwaps();
  }, [toast]);

  const handleAccept = async (swapId: string) => {
    try {
      await apiService.acceptSwap(swapId);
      setSwaps(prev => prev.map(swap => 
        swap.id === swapId ? { ...swap, status: 'accepted' } : swap
      ));
      toast({
        title: "Swap Accepted",
        description: "The swap request has been accepted.",
      });
      onSwapUpdate?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept swap request",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (swapId: string) => {
    try {
      await apiService.rejectSwap(swapId);
      setSwaps(prev => prev.map(swap => 
        swap.id === swapId ? { ...swap, status: 'rejected' } : swap
      ));
      toast({
        title: "Swap Rejected",
        description: "The swap request has been rejected.",
      });
      onSwapUpdate?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject swap request",
        variant: "destructive",
      });
    }
  };

  const handleComplete = async (swapId: string) => {
    try {
      await apiService.completeSwap(swapId);
      setSwaps(prev => prev.map(swap => 
        swap.id === swapId ? { ...swap, status: 'completed' } : swap
      ));
      toast({
        title: "Swap Completed",
        description: "The swap has been marked as completed.",
      });
      onSwapUpdate?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete swap",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="text-blue-500" size={20} />
            Swap Requests
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
          <ArrowRightLeft className="text-blue-500" size={20} />
          Swap Requests ({swaps.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {swaps.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ArrowRightLeft size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No swap requests yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {swaps.map((swap) => (
              <div
                key={swap.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(swap.status)}>
                      {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {swap.createdAt 
                        ? new Date(swap.createdAt).toLocaleDateString()
                        : 'Unknown date'
                      }
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Offered Item */}
                  <div className="border rounded-lg p-3 bg-green-50">
                    <h4 className="font-medium text-green-800 mb-2">Offered Item</h4>
                    <div className="flex items-center gap-3">
                      <img
                        src={swap.itemOffered?.images[0] || "/placeholder.svg"}
                        alt={swap.itemOffered?.title || "Item"}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-medium">{swap.itemOffered?.title}</p>
                        <p className="text-sm text-gray-600">
                          {swap.itemOffered?.category} • {swap.itemOffered?.size}
                        </p>
                        <p className="text-sm text-gray-600">
                          By: {swap.initiator?.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Requested Item */}
                  <div className="border rounded-lg p-3 bg-blue-50">
                    <h4 className="font-medium text-blue-800 mb-2">Requested Item</h4>
                    <div className="flex items-center gap-3">
                      <img
                        src={swap.itemRequested?.images[0] || "/placeholder.svg"}
                        alt={swap.itemRequested?.title || "Item"}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-medium">{swap.itemRequested?.title}</p>
                        <p className="text-sm text-gray-600">
                          {swap.itemRequested?.category} • {swap.itemRequested?.size}
                        </p>
                        <p className="text-sm text-gray-600">
                          By: {swap.responder?.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 justify-end">
                  {swap.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAccept(swap.id)}
                        className="flex items-center gap-1 text-green-600 hover:bg-green-50"
                      >
                        <Check size={16} />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(swap.id)}
                        className="flex items-center gap-1 text-red-600 hover:bg-red-50"
                      >
                        <X size={16} />
                        Reject
                      </Button>
                    </>
                  )}
                  {swap.status === 'accepted' && (
                    <Button
                      size="sm"
                      onClick={() => handleComplete(swap.id)}
                      className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
                    >
                      <Check size={16} />
                      Mark Complete
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SwapRequests;
