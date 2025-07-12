
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Package, X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";
import { CreateItemRequest } from "@/types/api";

const AddItemForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [size, setSize] = useState("");
  const [condition, setCondition] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // if (images.length === 0) {
    //   toast({
    //     title: "Error",
    //     description: "Please upload at least one image.",
    //     variant: "destructive",
    //   });
    //   return;
    // }

    setIsSubmitting(true);

    try {
      const itemData: CreateItemRequest = {
        title,
        description,
        category: category as 'Men' | 'Women' | 'Kids',
        size: size as 'S' | 'M' | 'L' | 'XL',
        condition: condition as 'New' | 'Like New' | 'Used',
        tags,
        images,
      };

      await apiService.createItem(itemData);
      
      toast({
        title: "Item Listed!",
        description: "Your item has been submitted and is pending approval.",
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-4">
              <Package size={32} className="text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">List New Item</CardTitle>
            <p className="text-gray-600">Share your unused clothing with the community</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-700 font-medium">
                  Item Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Vintage Denim Jacket"
                  className="rounded-xl border-gray-200 focus:border-green-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-700 font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the item, its condition, and any special details..."
                  className="rounded-xl border-gray-200 focus:border-green-400 min-h-[100px]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Category</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger className="rounded-xl border-gray-200">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Men">Men</SelectItem>
                      <SelectItem value="Women">Women</SelectItem>
                      <SelectItem value="Kids">Kids</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Size</Label>
                  <Select value={size} onValueChange={setSize} required>
                    <SelectTrigger className="rounded-xl border-gray-200">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="S">S</SelectItem>
                      <SelectItem value="M">M</SelectItem>
                      <SelectItem value="L">L</SelectItem>
                      <SelectItem value="XL">XL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Condition</Label>
                <Select value={condition} onValueChange={setCondition} required>
                  <SelectTrigger className="rounded-xl border-gray-200">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Like New">Like New</SelectItem>
                    <SelectItem value="Used">Used</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">
                  Tags
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag..."
                    className="rounded-xl border-gray-200 focus:border-green-400"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    variant="outline"
                    className="px-3"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <X
                          size={14}
                          className="cursor-pointer hover:text-red-500"
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Photos</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 transition-colors">
                  <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload photos</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 10MB each</p>
                  <Button type="button" variant="outline" className="mt-4">
                    Choose Files
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50"
              >
                {isSubmitting ? "Creating Item..." : "List Item"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddItemForm;
