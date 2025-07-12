import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Heart, MessageCircle, ArrowRightLeft } from "lucide-react";
import { Item } from "@/types/api";

interface ItemCardProps {
  item: Item;
  onSwapRequest?: (item: Item) => void;
  onViewDetails?: (item: Item) => void;
  showOwner?: boolean;
}

const ItemCard = ({ item, onSwapRequest, onViewDetails, showOwner = true }: ItemCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'swapped':
        return 'bg-blue-100 text-blue-800';
      case 'reserved':
        return 'bg-purple-100 text-purple-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'New':
        return 'bg-green-100 text-green-800';
      case 'Like New':
        return 'bg-blue-100 text-blue-800';
      case 'Used':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm">
      <CardContent className="p-0">
        {/* Image Section */}
        <div className="relative aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
          {item.images.length > 0 ? (
            <img 
              src={item.images[0]} 
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={48} className="text-gray-400" />
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-2 right-2">
            <Badge className={getStatusColor(item.status)}>
              {item.status}
            </Badge>
          </div>
          
          {/* Favorite Button */}
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-2 left-2 w-8 h-8 p-0 bg-white/80 hover:bg-white/90"
          >
            <Heart size={16} className="text-gray-600" />
          </Button>
        </div>

        {/* Content Section */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-800 line-clamp-1">{item.title}</h3>
          </div>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
          
          {/* Item Details */}
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="outline" className="text-xs">
              {item.category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Size {item.size}
            </Badge>
            <Badge variant="outline" className={`text-xs ${getConditionColor(item.condition)}`}>
              {item.condition}
            </Badge>
          </div>
          
          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {item.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              {item.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{item.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}
          
          {/* Owner Info */}
          {showOwner && item.owner && (
            <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
              <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium">
                  {item.owner.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span>{item.owner.name}</span>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs"
              onClick={() => onViewDetails?.(item)}
            >
              <MessageCircle size={14} className="mr-1" />
              View Details
            </Button>
            
            {item.status === 'available' && onSwapRequest && (
              <Button
                size="sm"
                className="flex-1 text-xs bg-green-600 hover:bg-green-700"
                onClick={() => onSwapRequest(item)}
              >
                <ArrowRightLeft size={14} className="mr-1" />
                Swap
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemCard;
