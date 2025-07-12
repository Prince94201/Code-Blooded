
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import Dashboard from "@/components/Dashboard";
import AddItemForm from "@/components/AddItemForm";
import LandingPage from "@/components/LandingPage";
import BrowsePage from "@/components/BrowsePage";
import ItemDetailPage from "@/components/ItemDetailPage";
import AdminPanel from "@/components/AdminPanel";
import { useLogin, useRegister, useUser } from "@/hooks/useApi";
import { apiService } from "@/services/api";

const Index = () => {
  const [currentPage, setCurrentPage] = useState<string>("landing");
  const [currentItemId, setCurrentItemId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Get user data from API
  const { data: user, isLoading: userLoading, error: userError } = useUser();
  
  // API hooks
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await loginMutation.mutateAsync({ email, password });
      // The user data will be automatically fetched by useUser hook
      setCurrentPage("dashboard");
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      await registerMutation.mutateAsync({ name, email, password });
      // The user data will be automatically fetched by useUser hook
      setCurrentPage("dashboard");
    } catch (error) {
      console.error('Register error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    apiService.logout();
    setCurrentPage("landing");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    // Force page reload to clear all cached data
    window.location.reload();
  };

  const handleNavigate = (page: string, itemId?: string) => {
    // If trying to access admin panel without admin role
    if (page === "admin" && user?.role !== "admin") {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin panel.",
        variant: "destructive"
      });
      return;
    }
    
    if (itemId) {
      setCurrentItemId(itemId);
    }
    setCurrentPage(page);
  };

  const handleAddItem = () => {
    toast({
      title: "Item Listed!",
      description: "Your item has been submitted and is pending approval.",
    });
    setCurrentPage("dashboard");
  };

  // Show loading state while checking authentication
  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page if not logged in and not on auth pages
  if (!user && !["login", "register"].includes(currentPage)) {
    if (currentPage === "register") {
      return (
        <RegisterForm
          onRegister={handleRegister}
          onSwitchToLogin={() => setCurrentPage("login")}
          isLoading={isLoading || registerMutation.isPending}
        />
      );
    }
    
    if (currentPage === "login") {
      return (
        <LoginForm
          onLogin={handleLogin}
          onSwitchToRegister={() => setCurrentPage("register")}
          isLoading={isLoading || loginMutation.isPending}
        />
      );
    }
    
    return <LandingPage onNavigate={handleNavigate} />;
  }

  // Show auth forms
  if (!user) {
    if (currentPage === "register") {
      return (
        <RegisterForm
          onRegister={handleRegister}
          onSwitchToLogin={() => setCurrentPage("login")}
          isLoading={isLoading || registerMutation.isPending}
        />
      );
    }
    
    return (
      <LoginForm
        onLogin={handleLogin}
        onSwitchToRegister={() => setCurrentPage("register")}
        isLoading={isLoading || loginMutation.isPending}
      />
    );
  }

  // Show main app if logged in
  return (
    <div className="min-h-screen">
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        user={user}
        onLogout={handleLogout}
      />
      
      {currentPage === "dashboard" && <Dashboard user={user} />}
      {currentPage === "add-item" && <AddItemForm onAddItem={handleAddItem} />}
      {currentPage === "browse" && <BrowsePage onNavigate={handleNavigate} />}
      {currentPage === "item-detail" && <ItemDetailPage onNavigate={handleNavigate} itemId={currentItemId} />}
      {currentPage === "admin" && user.role === "admin" && <AdminPanel onNavigate={handleNavigate} />}
      {currentPage === "landing" && <LandingPage onNavigate={handleNavigate} />}
    </div>
  );
};

export default Index;
