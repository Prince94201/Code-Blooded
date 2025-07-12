
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Heart, Share2, MessageCircle, Star, MapPin } from "lucide-react";

const ItemDetailPage = () => {
  const { id: itemId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Mock item data - in real app, this would use the itemId to fetch data
  const item = {
    id: itemId,
    title: "Vintage Denim Jacket",
    description: "This classic blue denim jacket is a timeless piece that never goes out of style. It's been gently worn and well-maintained, showing only minor signs of use that add to its vintage character. Perfect for layering over t-shirts or dresses. Features original buttons and classic stitching details.",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    category: "Jackets",
    size: "M",
    condition: "Like New",
    tags: ["vintage", "denim", "classic", "blue"],
    status: "available",
    owner: {
      id: "owner1",
      name: "Sarah Mitchell",
      profileImageUrl: "",
      rating: 4.8,
      totalSwaps: 12,
      location: "Portland, OR"
    },
    createdAt: "2024-01-15"
  };

  // Mock previous listings from the same owner
  const ownerPreviousListings = [
    {
      id: "2",
      title: "Summer Floral Dress",
      image: "/placeholder.svg",
      status: "swapped"
    },
    {
      id: "3", 
      title: "Leather Boots",
      image: "/placeholder.svg",
      status: "available"
    },
    {
      id: "4",
      title: "Wool Sweater",
      image: "/placeholder.svg", 
      status: "swapped"
    },
    {
      id: "5",
      title: "Silk Scarf",
      image: "/placeholder.svg",
      status: "available"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/browse')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Browse
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image Section */}
          <div className="space-y-4">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-gray-500">Main Product Image</div>
                </div>
              </CardContent>
            </Card>
            
            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {item.images.map((_, index) => (
                <Card 
                  key={index}
                  className={`cursor-pointer transition-all ${
                    selectedImageIndex === index 
                      ? 'ring-2 ring-green-500' 
                      : 'hover:ring-1 hover:ring-gray-300'
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <CardContent className="p-0">
                    <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                      <div className="text-xs text-gray-500">Img {index + 1}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{item.title}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">#{tag}</Badge>
                ))}
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <Badge variant="outline">{item.category}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Size</p>
                  <Badge variant="outline">{item.size}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Condition</p>
                  <Badge variant="outline">{item.condition}</Badge>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Description</h3>
                <p className="text-gray-700 leading-relaxed">{item.description}</p>
              </div>
            </div>

            {/* Owner Info */}
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Listed by</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-green-100 text-green-700">
                      {item.owner.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.owner.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{item.owner.rating}</span>
                      <span>•</span>
                      <span>{item.owner.totalSwaps} swaps</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{item.owner.location}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-lg py-6">
                Available for Swap
              </Button>
              
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm">
                  <Heart size={16} className="mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 size={16} className="mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <MessageCircle size={16} className="mr-2" />
                  Message
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Previous Listings */}
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Previous Listings from {item.owner.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ownerPreviousListings.map((listing) => (
                <Card 
                  key={listing.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/item/${listing.id}`)}
                >
                  <CardContent className="p-0">
                    <div className="aspect-square bg-gray-200 rounded-t-lg flex items-center justify-center">
                      <div className="text-gray-500 text-sm">Image</div>
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-sm mb-2">{listing.title}</h4>
                      <Badge 
                        variant={listing.status === 'available' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {listing.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ItemDetailPage;
