import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users,
  Package,
  ShoppingBag,
  TrendingUp,
  Search,
  Check,
  X,
  Ban,
  Eye,
  Loader2,
} from "lucide-react";
import PendingItemsAdmin from "./PendingItemsAdmin";
import { apiService } from "@/services/api";
import { User, Swap, Transaction } from "@/types/api";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "listings" | "orders"
  >("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for real data
  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    totalSwaps: 0,
    pendingListings: 0,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Fetch admin dashboard data
  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [dashboardData, usersData, swapsData, transactionsData] =
        await Promise.all([
          apiService.getAdminDashboard(),
          apiService.getUsers(),
          apiService.getAllSwaps(),
          apiService.getAllTransactions(),
        ]);

      // Map the dashboard data to our state structure
      setAdminStats({
        totalUsers: dashboardData.users,
        totalListings: dashboardData.items.total,
        totalSwaps: dashboardData.swaps.completed,
        pendingListings: dashboardData.items.pending,
      });

      setUsers(usersData);
      setSwaps(swapsData);
      setTransactions(transactionsData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load admin data"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle user ban/unban
  const handleBanUser = async (userId: string, currentRole: string) => {
    try {
      console.log(
        `Toggling ban status for user ${userId} (current role: ${currentRole})`
      );
      await apiService.banUser(userId);

      // Update local state
      setUsers(
        users.map((user) =>
          user.id === userId
            ? {
                ...user,
                role:
                  currentRole === "banned"
                    ? ("user" as const)
                    : ("banned" as const),
              }
            : user
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to ban/unban user");
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-green-600" />
          <p className="mt-4 text-gray-600">Loading admin data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Panel</h1>
          <p className="text-gray-600">
            Manage users, listings, and platform operations
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { key: "overview", label: "Overview", icon: TrendingUp },
            { key: "users", label: "Manage Users", icon: Users },
            { key: "listings", label: "Manage Listings", icon: Package },
            { key: "orders", label: "Manage Orders", icon: ShoppingBag },
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={activeTab === key ? "default" : "outline"}
              onClick={() => setActiveTab(key as typeof activeTab)}
              className="flex items-center gap-2"
            >
              <Icon size={16} />
              {label}
            </Button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <Users className="mx-auto mb-4 text-blue-500" size={32} />
                  <h3 className="text-2xl font-bold text-gray-800">
                    {adminStats.totalUsers}
                  </h3>
                  <p className="text-gray-600">Total Users</p>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <Package className="mx-auto mb-4 text-green-500" size={32} />
                  <h3 className="text-2xl font-bold text-gray-800">
                    {adminStats.totalListings}
                  </h3>
                  <p className="text-gray-600">Total Listings</p>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <ShoppingBag
                    className="mx-auto mb-4 text-purple-500"
                    size={32}
                  />
                  <h3 className="text-2xl font-bold text-gray-800">
                    {adminStats.totalSwaps}
                  </h3>
                  <p className="text-gray-600">Completed Swaps</p>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <TrendingUp
                    className="mx-auto mb-4 text-orange-500"
                    size={32}
                  />
                  <h3 className="text-2xl font-bold text-gray-800">
                    {adminStats.pendingListings}
                  </h3>
                  <p className="text-gray-600">Pending Reviews</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Recent Platform Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">New user registration</p>
                      <p className="text-sm text-gray-600">
                        Emma Wilson joined the platform
                      </p>
                    </div>
                    <div className="ml-auto text-sm text-gray-500">
                      2 hours ago
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Swap completed</p>
                      <p className="text-sm text-gray-600">
                        John & Sarah completed a swap
                      </p>
                    </div>
                    <div className="ml-auto text-sm text-gray-500">
                      4 hours ago
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Manage Users</h2>
              <div className="relative">
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
              </div>
            </div>

            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="space-y-4 p-6">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback className="bg-green-100 text-green-700">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{user.name}</h4>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-sm text-gray-500">
                            {user.points} points
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            user.role === "banned" ? "destructive" : "default"
                          }
                        >
                          {user.role}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Eye size={16} className="mr-2" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleBanUser(user.id, user.role)}
                        >
                          <Ban size={16} className="mr-2" />
                          {user.role === "banned" ? "Unban" : "Ban"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Listings Tab */}
        {activeTab === "listings" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Pending Listings
            </h2>
            <PendingItemsAdmin />
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Recent Orders</h2>

            {/* Swaps Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Recent Swaps
              </h3>
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardContent className="p-0">
                  <div className="space-y-4 p-6">
                    {swaps.slice(0, 5).map((swap) => (
                      <div
                        key={swap.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <h4 className="font-semibold">Swap Request</h4>
                          <p className="text-sm text-gray-600">
                            {swap.initiator?.name} wants to swap "
                            {swap.itemOffered?.title}" for "
                            {swap.itemRequested?.title}"
                          </p>
                          <p className="text-sm text-gray-500">
                            {swap.createdAt
                              ? new Date(swap.createdAt).toLocaleDateString()
                              : "Unknown date"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              swap.status === "completed"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {swap.status}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Eye size={16} className="mr-2" />
                            Details
                          </Button>
                        </div>
                      </div>
                    ))}
                    {swaps.length === 0 && (
                      <p className="text-gray-500 text-center py-8">
                        No swaps found
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Transactions Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Recent Redemptions
              </h3>
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardContent className="p-0">
                  <div className="space-y-4 p-6">
                    {transactions
                      .filter((t) => t.type === "redeem")
                      .slice(0, 5)
                      .map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <h4 className="font-semibold">Point Redemption</h4>
                            <p className="text-sm text-gray-600">
                              User redeemed "
                              {typeof transaction.itemId === "object" &&
                              transaction.itemId
                                ? transaction.itemId.title
                                : transaction.item?.title || "Unknown item"}
                              " for {transaction.pointsUsed} points
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(
                                transaction.createdAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="default">completed</Badge>
                            <Button size="sm" variant="outline">
                              <Eye size={16} className="mr-2" />
                              Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    {transactions.filter((t) => t.type === "redeem").length ===
                      0 && (
                      <p className="text-gray-500 text-center py-8">
                        No redemptions found
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
