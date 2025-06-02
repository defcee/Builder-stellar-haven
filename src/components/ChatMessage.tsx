import React from "react";
import { Message, User } from "@/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

interface ChatMessageProps {
  message: Message;
  isOwn: boolean;
  sender?: User;
  className?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isOwn,
  sender,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex gap-2 mb-4",
        isOwn ? "flex-row-reverse" : "flex-row",
        className,
      )}
    >
      {!isOwn && sender && (
        <Avatar className="w-8 h-8">
          <AvatarImage src={sender.avatar} alt={sender.name} />
          <AvatarFallback>
            {sender.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "max-w-[80%] space-y-1",
          isOwn ? "items-end" : "items-start",
          "flex flex-col",
        )}
      >
        {!isOwn && sender && (
          <span className="text-xs text-gray-500 px-3">{sender.name}</span>
        )}

        <div
          className={cn(
            "px-4 py-2 rounded-2xl break-words",
            isOwn
              ? "bg-green-600 text-white rounded-br-md"
              : "bg-gray-100 text-gray-900 rounded-bl-md",
          )}
        >
          <p className="text-sm">{message.content}</p>
        </div>

        <span
          className={cn(
            "text-xs text-gray-400 px-3",
            isOwn ? "text-right" : "text-left",
          )}
        >
          {format(message.createdAt, "HH:mm")}
          {isOwn && !message.read && (
            <span className="ml-1 text-gray-500">•</span>
          )}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
