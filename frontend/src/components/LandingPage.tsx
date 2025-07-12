
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Star, Users, Recycle, ArrowRight } from "lucide-react";

const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock featured items
  const featuredItems = [
    {
      id: 1,
      title: "Vintage Denim Jacket",
      category: "Jackets",
      condition: "Like New",
      images: ["/placeholder.svg"],
      owner: "Sarah M."
    },
    {
      id: 2,
      title: "Summer Floral Dress",
      category: "Dresses",
      condition: "New",
      images: ["/placeholder.svg"],
      owner: "Emma K."
    },
    {
      id: 3,
      title: "Nike Running Shoes",
      category: "Shoes",
      condition: "Used",
      images: ["/placeholder.svg"],
      owner: "Mike D."
    },
    {
      id: 4,
      title: "Wool Winter Coat",
      category: "Outerwear",
      condition: "Like New",
      images: ["/placeholder.svg"],
      owner: "Lisa R."
    }
  ];

  const categories = [
    "Men's Clothing",
    "Women's Clothing", 
    "Kids' Clothing",
    "Shoes",
    "Accessories",
    "Outerwear"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              ♻️ ReWear
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Community Clothing Exchange
            </p>
            <p className="text-lg mb-12 opacity-80 max-w-2xl mx-auto">
              Turn your closet into a marketplace. Swap, redeem, and discover sustainable fashion in your community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {/* <Button 
                size="lg" 
                className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-3"
                asChild
              >
                <Link to="/browse">
                  Start Browsing
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              </Button> */}
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-green-600 text-lg px-8 py-3"
                asChild
              >
                <Link to="/login">
                  Join Community
                </Link>
              </Button>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Input
                type="text"
                placeholder="Search for clothing items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 text-lg rounded-full border-0 shadow-lg"
              />
              <Button 
                size="lg"
                className="absolute right-2 top-2 rounded-full bg-green-600 hover:bg-green-700"
                asChild
              >
                <Link to="/browse">
                  <Search size={20} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <Link key={index} to="/browse">
              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Recycle className="text-white" size={24} />
                  </div>
                <h3 className="font-semibold text-gray-800">{category}</h3>
              </CardContent>
            </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Items */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Featured Items
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map((item) => (
          <Link key={item.id} to={`/item/${item.id}`}>
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm"
            >
              <CardContent className="p-0">
                <div className="aspect-square bg-gray-200 rounded-t-lg flex items-center justify-center">
                  <div className="text-gray-500">Item Image</div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">by {item.owner}</p>
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary">{item.category}</Badge>
                    <Badge variant="outline">{item.condition}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white/50 backdrop-blur-sm py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <Users className="mx-auto mb-4 text-green-600" size={48} />
              <h3 className="text-3xl font-bold text-gray-800 mb-2">1,200+</h3>
              <p className="text-gray-600">Active Members</p>
            </div>
            <div>
              <Recycle className="mx-auto mb-4 text-green-600" size={48} />
              <h3 className="text-3xl font-bold text-gray-800 mb-2">5,400+</h3>
              <p className="text-gray-600">Items Exchanged</p>
            </div>
            <div>
              <Star className="mx-auto mb-4 text-green-600" size={48} />
              <h3 className="text-3xl font-bold text-gray-800 mb-2">4.8/5</h3>
              <p className="text-gray-600">Community Rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
