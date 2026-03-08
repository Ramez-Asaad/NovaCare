"use client";

import { useState } from "react";
import { Phone, Video, MessageCircle, Send, Paperclip, Smile, Clock, PhoneCall, VideoIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, Button, Avatar, Input, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

const messages = [
  {
    id: 1,
    sender: "patient",
    content: "Good morning! I just took my medication.",
    time: "8:05 AM",
    type: "text",
  },
  {
    id: 2,
    sender: "guardian",
    content: "That's great, Sarah! How are you feeling today?",
    time: "8:10 AM",
    type: "text",
  },
  {
    id: 3,
    sender: "patient",
    content: "Feeling pretty good! NovaCare helped me make breakfast.",
    time: "8:15 AM",
    type: "text",
  },
  {
    id: 4,
    sender: "guardian",
    content: "Wonderful! I'll call you later this afternoon. Love you!",
    time: "8:20 AM",
    type: "text",
  },
  {
    id: 5,
    sender: "patient",
    content: "Love you too! 💕",
    time: "8:22 AM",
    type: "text",
  },
];

const callHistory = [
  {
    id: 1,
    type: "video",
    duration: "15 min",
    time: "Yesterday, 3:30 PM",
    status: "completed",
  },
  {
    id: 2,
    type: "voice",
    duration: "8 min",
    time: "Jan 17, 6:00 PM",
    status: "completed",
  },
  {
    id: 3,
    type: "video",
    duration: "5 min",
    time: "Jan 16, 2:15 PM",
    status: "missed",
  },
];

export default function CommunicationPage() {
  const [message, setMessage] = useState("");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 hover:shadow-soft transition-shadow cursor-pointer">
          <CardContent className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center">
              <Phone className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="font-semibold text-text-primary dark:text-white">Voice Call</p>
              <p className="text-sm text-text-muted dark:text-gray-400">Call Sarah now</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 hover:shadow-soft transition-shadow cursor-pointer">
          <CardContent className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-500 flex items-center justify-center">
              <Video className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="font-semibold text-text-primary dark:text-white">Video Call</p>
              <p className="text-sm text-text-muted dark:text-gray-400">Privacy-first video</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary-50 dark:bg-secondary-900/30 border border-secondary-200 dark:border-secondary-800 hover:shadow-soft transition-shadow cursor-pointer">
          <CardContent className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="font-semibold text-text-primary dark:text-white">Schedule Call</p>
              <p className="text-sm text-text-muted dark:text-gray-400">Plan a call ahead</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Messages */}
        <Card variant="elevated" className="lg:col-span-2 flex flex-col h-[600px]">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Avatar name="Sarah Johnson" status="online" />
              <div>
                <CardTitle>Sarah Johnson</CardTitle>
                <p className="text-sm text-success flex items-center gap-1">
                  <span className="w-2 h-2 bg-success rounded-full" />
                  Online
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden flex flex-col">
            {/* Messages List */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    msg.sender === "guardian" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[70%] px-4 py-3 rounded-2xl",
                      msg.sender === "guardian"
                        ? "bg-primary text-white rounded-br-none"
                        : "bg-gray-100 dark:bg-gray-700 text-text-primary dark:text-white rounded-bl-none"
                    )}
                  >
                    <p>{msg.content}</p>
                    <p
                      className={cn(
                        "text-xs mt-1",
                        msg.sender === "guardian" ? "text-primary-200" : "text-text-muted dark:text-gray-400"
                      )}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}            
            </div>

            {/* Message Input */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Paperclip className="w-5 h-5 text-text-muted dark:text-gray-400" />
              </button>
              <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Smile className="w-5 h-5 text-text-muted dark:text-gray-400" />
              </button>
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-text-primary dark:text-white placeholder:text-text-muted dark:placeholder:text-gray-400 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Button
                leftIcon={<Send className="w-4 h-4" />}
                disabled={!message.trim()}
              >
                Send
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Call History */}
        <Card variant="elevated" className="h-fit">
          <CardHeader>
            <CardTitle>Call History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {callHistory.map((call) => (
              <div
                key={call.id}
                className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    call.type === "video" ? "bg-purple-100 dark:bg-purple-900/50" : "bg-primary-100 dark:bg-primary-900/50"
                  )}
                >
                  {call.type === "video" ? (
                    <VideoIcon
                      className={cn(
                        "w-5 h-5",
                        call.status === "missed" ? "text-accent" : "text-purple-500"
                      )}
                    />
                  ) : (
                    <PhoneCall
                      className={cn(
                        "w-5 h-5",
                        call.status === "missed" ? "text-accent" : "text-primary"
                      )}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-text-primary dark:text-white capitalize">
                    {call.type} Call
                    {call.status === "missed" && (
                      <Badge variant="danger" className="ml-2">
                        Missed
                      </Badge>
                    )}
                  </p>
                  <p className="text-sm text-text-muted dark:text-gray-400">
                    {call.status === "completed" ? call.duration : ""} • {call.time}
                  </p>
                </div>
              </div>
            ))}

            <Button variant="outline" className="w-full mt-4 dark:text-white dark:hover:text-text-primary">
              View All History
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
