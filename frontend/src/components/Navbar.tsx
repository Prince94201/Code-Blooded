
import { User, LogOut, Home, Plus, Search, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

interface NavbarProps {
  user: {
    id: string;
    name: string;
    profileImageUrl?: string;
    role?: string;
  };
  onLogout: () => void;
}

const Navbar = ({ user, onLogout }: NavbarProps) => {
  const location = useLocation();
  
  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent cursor-pointer">
                ♻️ ReWear
              </h1>
            </Link>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <Button
                variant={location.pathname === '/dashboard' ? 'default' : 'ghost'}
                asChild
                className="flex items-center space-x-2"
              >
                <Link to="/dashboard">
                  <Home size={16} />
                  <span className="hidden sm:block">Dashboard</span>
                </Link>
              </Button>
              
              {/* <Button
                variant={location.pathname === '/browse' ? 'default' : 'ghost'}
                asChild
                className="flex items-center space-x-2"
              >
                <Link to="/browse">
                  <Search size={16} />
                  <span className="hidden sm:block">Browse</span>
                </Link>
              </Button> */}
              
              <Button
                variant={location.pathname === '/add-item' ? 'default' : 'ghost'}
                asChild
                className="flex items-center space-x-2"
              >
                <Link to="/add-item">
                  <Plus size={16} />
                  <span className="hidden sm:block">Add Item</span>
                </Link>
              </Button>
              
              {user.role === 'admin' && (
                <Button
                  variant={location.pathname === '/admin' ? 'default' : 'ghost'}
                  asChild
                  className="flex items-center space-x-2"
                >
                  <Link to="/admin">
                    <Shield size={16} />
                    <span className="hidden sm:block">Admin</span>
                  </Link>
                </Button>
              )}
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {user.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                  )}
                  <span className="hidden sm:block font-medium text-gray-700">
                    {user.name}
                  </span>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:block ml-1">Logout</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
