"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, Send } from "lucide-react";

// Replace with your YouTube Data API Key
const YOUTUBE_API_KEY = "YOUR_YOUTUBE_API_KEY";

export default function WatchGroup() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [participants] = useState([
    { id: 1, name: "Alice", avatar: "A" },
    { id: 2, name: "Bob", avatar: "B" },
    { id: 3, name: "Charlie", avatar: "C" },
  ]);
  const [messages, setMessages] = useState([
    { id: 1, user: "Alice", text: "Hey everyone! Ready to watch?" },
    { id: 2, user: "Bob", text: "Yep! Let’s go 🎬" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  // 🔎 Fetch YouTube suggestions
  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (!query) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q=${encodeURIComponent(
          query
        )}&key=${YOUTUBE_API_KEY}`
      );
      const data = await res.json();
      if (data.items) {
        setSearchResults(
          data.items.map((item: any) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            channelTitle: item.snippet.channelTitle,
            thumbnail: item.snippet.thumbnails.default.url,
          }))
        );
      }
    } catch (err) {
      console.error("Error fetching YouTube search results", err);
    }
  };

  // 💬 Handle sending chat messages
  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([
      ...messages,
      { id: messages.length + 1, user: "You", text: newMessage },
    ]);
    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-gray-800">
        <h1 className="text-xl font-bold">🎥 WatchGroup</h1>
        <div className="flex items-center space-x-4">
          <Users className="h-5 w-5" />
          <span>{participants.length} watching</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Search Bar */}
          <div className="p-4 bg-gray-800 flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Search YouTube..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 bg-gray-700 border-gray-600 text-white"
            />
            <Button
              variant="secondary"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Auto-suggest Results */}
          {searchResults.length > 0 && (
            <div className="p-4 bg-gray-800">
              <h3 className="text-white font-semibold mb-2">Suggestions</h3>
              <div className="space-y-2">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center space-x-3 bg-gray-700 p-2 rounded-lg cursor-pointer hover:bg-gray-600"
                    onClick={() => {
                      setSelectedVideo(result);
                      setSearchResults([]);
                      setSearchQuery("");
                    }}
                  >
                    <img
                      src={result.thumbnail}
                      alt={result.title}
                      className="w-16 h-10 rounded"
                    />
                    <div>
                      <p className="text-sm font-medium">{result.title}</p>
                      <p className="text-xs text-gray-400">
                        {result.channelTitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video Player */}
          {selectedVideo ? (
            <div className="bg-black flex-1 flex flex-col">
              <iframe
                className="w-full flex-1"
                src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <div className="p-4 bg-gray-800">
                <h3 className="text-white text-lg font-semibold">
                  {selectedVideo.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  🎬 Playing from YouTube
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              🔍 Search for a video to start watching
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-80 bg-gray-800 flex flex-col border-l border-gray-700">
          {/* Participants */}
          <div className="p-4 border-b border-gray-700">
            <h2 className="font-semibold mb-2">Participants</h2>
            <div className="space-y-2">
              {participants.map((p) => (
                <div key={p.id} className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    {p.avatar}
                  </div>
                  <span>{p.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-4 space-y-2 overflow-y-auto">
              {messages.map((msg) => (
                <div key={msg.id}>
                  <span className="font-semibold">{msg.user}: </span>
                  <span>{msg.text}</span>
                </div>
              ))}
            </div>
            <div className="p-4 flex space-x-2 border-t border-gray-700">
              <Input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 bg-gray-700 border-gray-600 text-white"
              />
              <Button
                onClick={sendMessage}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
