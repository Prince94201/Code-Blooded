
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import { useRegister } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match!",
        variant: "destructive"
      });
      return;
    }
    try {
      await registerMutation.mutateAsync({ name, email, password });
      navigate('/dashboard');
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
            <UserPlus size={40} className="text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800">Join ReWear</CardTitle>
            <CardDescription className="text-gray-600">
              Start your sustainable fashion journey today
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="px-4 py-3 rounded-xl border-gray-200 focus:border-green-400 focus:ring-green-400"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="px-4 py-3 rounded-xl border-gray-200 focus:border-green-400 focus:ring-green-400"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="px-4 py-3 rounded-xl border-gray-200 focus:border-green-400 focus:ring-green-400"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="px-4 py-3 rounded-xl border-gray-200 focus:border-green-400 focus:ring-green-400"
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
          
          <div className="mt-4 p-4 bg-green-50 rounded-xl">
            <p className="text-sm text-green-700 text-center">
              <span className="font-semibold">Form-based login/signup</span><br />
              <span className="text-green-600">Option for social login<br />
              Redirects to dashboard upon success</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterForm;
