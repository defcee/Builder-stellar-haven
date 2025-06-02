import React from "react";
import { Product } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MessageCircle, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onEdit?: () => void;
  showStats?: boolean;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  showStats = true,
  className,
}) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="relative">
        <img
          src={product.images[0] || "/placeholder.svg"}
          alt={product.title}
          className="w-full h-48 object-cover"
        />
        {!product.inStock && (
          <Badge className="absolute top-2 left-2 bg-red-500">
            Out of Stock
          </Badge>
        )}
        {onEdit && (
          <Button
            size="sm"
            variant="secondary"
            className="absolute top-2 right-2 w-8 h-8 p-0"
            onClick={onEdit}
          >
            <Edit3 className="w-4 h-4" />
          </Button>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2">
            {product.title}
          </h3>
          <span className="text-lg font-bold text-green-600 ml-2">
            ${product.price.toFixed(2)}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        <Badge variant="outline" className="mb-3">
          {product.category}
        </Badge>

        {showStats && (
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{product.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{product.inquiries}</span>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          variant={product.inStock ? "default" : "secondary"}
          disabled={!product.inStock}
        >
          {product.inStock ? "Contact Seller" : "Out of Stock"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
