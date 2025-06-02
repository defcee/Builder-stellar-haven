import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import ChatMessage from "@/components/ChatMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Send,
  Search,
  ArrowLeft,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
} from "lucide-react";
import { format } from "date-fns";

const Chat: React.FC = () => {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock conversations data
  const mockConversations = [
    {
      id: "1",
      participant: {
        id: "2",
        name: "Sarah Johnson",
        avatar: "",
        isOnline: true,
      },
      lastMessage: {
        id: "1",
        content:
          "Hi! I'm interested in your organic tomatoes. Are they still available?",
        fromUserId: "2",
        toUserId: user?.id || "",
        read: false,
        createdAt: new Date(Date.now() - 300000), // 5 minutes ago
      },
      unreadCount: 2,
      updatedAt: new Date(Date.now() - 300000),
    },
    {
      id: "2",
      participant: {
        id: "3",
        name: "Mike Chen",
        avatar: "",
        isOnline: false,
      },
      lastMessage: {
        id: "2",
        content:
          "Thanks for the quick delivery! The vegetables were fresh and delicious.",
        fromUserId: "3",
        toUserId: user?.id || "",
        read: true,
        createdAt: new Date(Date.now() - 3600000), // 1 hour ago
      },
      unreadCount: 0,
      updatedAt: new Date(Date.now() - 3600000),
    },
    {
      id: "3",
      participant: {
        id: "4",
        name: "Emma Wilson",
        avatar: "",
        isOnline: true,
      },
      lastMessage: {
        id: "3",
        content: "What time does your farm market open tomorrow?",
        fromUserId: "4",
        toUserId: user?.id || "",
        read: false,
        createdAt: new Date(Date.now() - 7200000), // 2 hours ago
      },
      unreadCount: 1,
      updatedAt: new Date(Date.now() - 7200000),
    },
  ];

  // Mock messages for selected conversation
  const mockMessages = [
    {
      id: "1",
      content:
        "Hi! I'm interested in your organic tomatoes. Are they still available?",
      fromUserId: "2",
      toUserId: user?.id || "",
      read: true,
      createdAt: new Date(Date.now() - 600000),
    },
    {
      id: "2",
      content:
        "Yes, we have fresh organic tomatoes available! They were just harvested this morning. How many kilograms would you like?",
      fromUserId: user?.id || "",
      toUserId: "2",
      read: true,
      createdAt: new Date(Date.now() - 480000),
    },
    {
      id: "3",
      content:
        "That sounds perfect! I would like 5kg. What's the price per kg?",
      fromUserId: "2",
      toUserId: user?.id || "",
      read: true,
      createdAt: new Date(Date.now() - 360000),
    },
    {
      id: "4",
      content:
        "It's $5.99 per kg for the organic tomatoes. So for 5kg it would be $29.95. Would you like to pick them up or would you prefer delivery?",
      fromUserId: user?.id || "",
      toUserId: "2",
      read: true,
      createdAt: new Date(Date.now() - 240000),
    },
    {
      id: "5",
      content:
        "Great! I'll pick them up. What time would be convenient for you?",
      fromUserId: "2",
      toUserId: user?.id || "",
      read: false,
      createdAt: new Date(Date.now() - 300000),
    },
  ];

  const filteredConversations = mockConversations.filter((conv) =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectedConv = mockConversations.find(
    (conv) => conv.id === selectedConversation,
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation, mockMessages]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    // In a real app, this would send the message via API
    console.log("Sending message:", messageInput);
    setMessageInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!selectedConversation) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-gray-900">Messages</h1>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </header>

        {/* Conversations List */}
        <main className="px-4 py-6 space-y-2">
          {filteredConversations.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Send className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">
                  No conversations yet
                </h3>
                <p className="text-sm text-gray-600">
                  Start connecting with buyers and other farmers to grow your
                  network!
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredConversations.map((conversation) => (
              <Card
                key={conversation.id}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={conversation.participant.avatar}
                          alt={conversation.participant.name}
                        />
                        <AvatarFallback>
                          {conversation.participant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.participant.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-gray-900 truncate">
                          {conversation.participant.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {format(conversation.updatedAt, "HH:mm")}
                          </span>
                          {conversation.unreadCount > 0 && (
                            <Badge className="w-5 h-5 rounded-full bg-green-600 text-xs">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage.content}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </main>

        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20 flex flex-col">
      {/* Chat Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedConversation(null)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={selectedConv?.participant.avatar}
                  alt={selectedConv?.participant.name}
                />
                <AvatarFallback>
                  {selectedConv?.participant.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {selectedConv?.participant.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>

            <div className="flex-1">
              <h2 className="font-medium text-gray-900">
                {selectedConv?.participant.name}
              </h2>
              <p className="text-xs text-gray-500">
                {selectedConv?.participant.isOnline
                  ? "Online"
                  : "Last seen recently"}
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <Phone className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="space-y-4">
          {mockMessages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isOwn={message.fromUserId === user?.id}
              sender={
                message.fromUserId !== user?.id
                  ? selectedConv?.participant
                  : undefined
              }
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Message Input */}
      <footer className="border-t bg-white p-4">
        <div className="flex items-end gap-2">
          <Button variant="ghost" size="sm">
            <Paperclip className="w-5 h-5" />
          </Button>

          <div className="flex-1 relative">
            <Input
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-10"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="bg-green-600 hover:bg-green-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </footer>

      <Navigation />
    </div>
  );
};

export default Chat;
