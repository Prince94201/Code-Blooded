
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Coins, Package, ShoppingBag, User, Edit, Search, RefreshCw } from "lucide-react";
import { useDashboard } from "@/hooks/useApi";
import { Skeleton } from "@/components/ui/skeleton";
import SwapRequests from "./SwapRequests";
import OrderHistory from "./OrderHistory";

interface DashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
    profileImageUrl?: string;
    points: number;
    role: string;
    createdAt: string;
  };
}

const Dashboard = ({ user }: DashboardProps) => {
  const { data: dashboardData, isLoading, error } = useDashboard();

  console.log("Transactions:", dashboardData?.transactions);
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          <Skeleton className="h-48 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  const listings = dashboardData?.items || [];
  const transactions = dashboardData?.transactions || [];
  const swaps = dashboardData?.swaps || [];
  const stats = dashboardData?.stats || {
    activeListings: 0,
    completedSwaps: 0,
    totalPointsEarned: 0,
    totalPointsSpent: 0
  };

  // Filter listings and transactions for display
  const availableListings = listings.filter(item => item.status === "available");
  const swappedListings = listings.filter(item => item.status === "swapped");
  const recentTransactions = transactions.slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              {user.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <User size={40} className="text-white" />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 md:ml-auto">
              <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
                <CardContent className="p-4 flex items-center gap-3">
                  <Coins size={24} />
                  <div>
                    <p className="text-sm opacity-90">Available Points</p>
                    <p className="text-2xl font-bold">{user.points}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Button className="bg-white text-green-600 hover:bg-gray-50 border border-green-200">
                <Edit size={16} className="mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
            <CardContent className="p-6 text-center">
              <Package className="mx-auto mb-4 text-blue-500" size={32} />
              <h3 className="text-2xl font-bold text-gray-800">{stats.activeListings}</h3>
              <p className="text-gray-600">Active Listings</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
            <CardContent className="p-6 text-center">
              <RefreshCw className="mx-auto mb-4 text-green-500" size={32} />
              <h3 className="text-2xl font-bold text-gray-800">{stats.completedSwaps}</h3>
              <p className="text-gray-600">Items Swapped</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
            <CardContent className="p-6 text-center">
              <ShoppingBag className="mx-auto mb-4 text-purple-500" size={32} />
              <h3 className="text-2xl font-bold text-gray-800">{transactions.length}</h3>
              <p className="text-gray-600">Items Redeemed</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
            <CardContent className="p-6 text-center">
              <Coins className="mx-auto mb-4 text-yellow-500" size={32} />
              <h3 className="text-2xl font-bold text-gray-800">{stats.totalPointsEarned}</h3>
              <p className="text-gray-600">Total Points Earned</p>
            </CardContent>
          </Card>
        </div>

        {/* My Listings Section */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Package size={24} className="text-green-600" />
                My Listings ({listings.length})
              </CardTitle>
              <Button variant="outline" size="sm">
                <Search size={16} className="mr-2" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {listings.length === 0 ? (
              <div className="text-center py-8">
                <Package size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No listings yet. Start by adding your first item!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {listings.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-100 rounded-xl p-4 hover:bg-gray-200 transition-colors cursor-pointer group"
                  >
                    <div className="aspect-square bg-gray-300 rounded-lg mb-3 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {item.images.length > 0 ? (
                        <img 
                          src={item.images[0]} 
                          alt={item.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package size={32} className="text-gray-500" />
                      )}
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{item.category} • Size {item.size}</p>
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        {item.condition}
                      </Badge>
                      <Badge 
                        variant={item.status === 'available' ? 'default' : 'secondary'}
                        className={item.status === 'available' ? 'bg-blue-100 text-blue-700' : ''}
                      >
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Redemptions Section */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <ShoppingBag size={24} className="text-purple-600" />
                My Redemptions ({transactions.length})
              </CardTitle>
              <Button variant="outline" size="sm">
                <Search size={16} className="mr-2" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No redemptions yet. Browse items to redeem with points!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {recentTransactions.map((transaction) => {
                  // Handle both populated itemId object and item property
                  const itemData = transaction.item || (typeof transaction.itemId === 'object' ? transaction.itemId : null);
                  
                  return (
                    <div
                      key={transaction.id}
                      className="bg-gray-100 rounded-xl p-4 hover:bg-gray-200 transition-colors cursor-pointer group"
                    >
                      <div className="aspect-square bg-gray-300 rounded-lg mb-3 flex items-center justify-center group-hover:scale-105 transition-transform">
                        {itemData?.images?.[0] ? (
                          <img 
                            src={itemData.images[0]} 
                            alt={itemData.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <ShoppingBag size={32} className="text-gray-500" />
                        )}
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-1">{itemData?.title || 'Unknown Item'}</h4>
                      <p className="text-sm text-gray-600 mb-2">{itemData?.category || 'Unknown Category'}</p>
                      <div className="flex justify-between items-center">
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                          -{transaction.pointsUsed} points
                        </Badge>
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Swap Requests Section */}
        <SwapRequests />

        {/* Order History Section */}
        <OrderHistory />
      </div>
    </div>
  );
};

export default Dashboard;
