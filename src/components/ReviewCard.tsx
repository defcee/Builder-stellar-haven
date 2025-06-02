import React from "react";
import { Review, User } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ReviewCardProps {
  review: Review;
  reviewer?: User;
  className?: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  reviewer,
  className,
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={cn(
          "w-4 h-4",
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
        )}
      />
    ));
  };

  return (
    <Card className={cn("", className)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={reviewer?.avatar} alt={reviewer?.name} />
            <AvatarFallback>
              {reviewer?.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">
                {reviewer?.name || "Anonymous User"}
              </h4>
              <span className="text-xs text-gray-500">
                {format(review.createdAt, "MMM d, yyyy")}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {renderStars(review.rating)}
              <span className="text-sm text-gray-600 ml-1">
                ({review.rating}/5)
              </span>
            </div>

            {review.comment && (
              <p className="text-sm text-gray-700 leading-relaxed">
                {review.comment}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
