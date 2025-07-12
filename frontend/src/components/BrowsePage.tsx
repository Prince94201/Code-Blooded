
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Grid, List } from "lucide-react";

const BrowsePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Mock items data
  const items = [
    {
      id: 1,
      title: "Vintage Denim Jacket",
      description: "Classic blue denim jacket, slightly worn but well-maintained.",
      category: "Men",
      size: "M",
      condition: "Like New",
      images: ["/placeholder.svg"],
      owner: { name: "Sarah M.", id: "1" },
      status: "available",
      tags: ["vintage", "denim"]
    },
    {
      id: 2,
      title: "Summer Floral Dress",
      description: "Beautiful floral print dress perfect for summer occasions.",
      category: "Women",
      size: "S",
      condition: "New",
      images: ["/placeholder.svg"],
      owner: { name: "Emma K.", id: "2" },
      status: "available",
      tags: ["floral", "summer"]
    },
    {
      id: 3,
      title: "Nike Running Shoes",
      description: "Comfortable running shoes, used but still in good shape.",
      category: "Men",
      size: "L",
      condition: "Used",
      images: ["/placeholder.svg"],
      owner: { name: "Mike D.", id: "3" },
      status: "available",
      tags: ["nike", "running"]
    },
    {
      id: 4,
      title: "Wool Winter Coat",
      description: "Warm wool coat, perfect for cold weather.",
      category: "Women",
      size: "L",
      condition: "Like New",
      images: ["/placeholder.svg"],
      owner: { name: "Lisa R.", id: "4" },
      status: "available",
      tags: ["wool", "winter"]
    },
    {
      id: 5,
      title: "Casual T-Shirt",
      description: "Comfortable cotton t-shirt in excellent condition.",
      category: "Kids",
      size: "M",
      condition: "Like New",
      images: ["/placeholder.svg"],
      owner: { name: "John S.", id: "5" },
      status: "available",
      tags: ["cotton", "casual"]
    },
    {
      id: 6,
      title: "Designer Handbag",
      description: "Luxury handbag in pristine condition.",
      category: "Women",
      size: "S",
      condition: "New",
      images: ["/placeholder.svg"],
      owner: { name: "Anna P.", id: "6" },
      status: "available",
      tags: ["designer", "luxury"]
    }
  ];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesSize = !selectedSize || item.size === selectedSize;
    const matchesCondition = !selectedCondition || item.condition === selectedCondition;
    
    return matchesSearch && matchesCategory && matchesSize && matchesCondition;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Browse Items</h1>
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <Input
              type="text"
              placeholder="Search for clothing items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  <SelectItem value="Men">Men</SelectItem>
                  <SelectItem value="Women">Women</SelectItem>
                  <SelectItem value="Kids">Kids</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Sizes</SelectItem>
                  <SelectItem value="S">S</SelectItem>
                  <SelectItem value="M">M</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="XL">XL</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Conditions</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Like New">Like New</SelectItem>
                  <SelectItem value="Used">Used</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid size={16} />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredItems.length} of {items.length} items
          </p>
        </div>

        {/* Items Grid/List */}
        <div className={viewMode === "grid" 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-4"
        }>
          {filteredItems.map((item) => (
          <Link key={item.id} to={`/item/${item.id}`}>
            <Card 
              className={`cursor-pointer hover:shadow-lg transition-shadow bg-white/90 backdrop-blur-sm ${
                viewMode === "list" ? "flex flex-row" : ""
              }`}
            >
              <CardContent className={`p-0 ${viewMode === "list" ? "flex w-full" : ""}`}>
                <div className={`bg-gray-200 flex items-center justify-center ${
                  viewMode === "list" 
                    ? "w-48 h-32 rounded-l-lg flex-shrink-0" 
                    : "aspect-square rounded-t-lg"
                }`}>
                  <div className="text-gray-500">Item Image</div>
                </div>
                <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                  <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                  {viewMode === "list" && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                  )}
                  <p className="text-sm text-gray-600 mb-2">by {item.owner.name}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{item.category}</Badge>
                    <Badge variant="outline">{item.condition}</Badge>
                    <Badge variant="outline">Size {item.size}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items found matching your criteria.</p>
            <Button 
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("");
                setSelectedSize("");
                setSelectedCondition("");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowsePage;
