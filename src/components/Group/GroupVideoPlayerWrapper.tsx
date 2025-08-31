import React, { useState, useEffect } from "react";
import { searchVideos } from "../../services/youtubeApi";
import { Video } from "../../types";
import { MessageSquare, Send } from "lucide-react";

interface GroupVideoPlayerProps {
  groupId: string;
  video: Video | null;
}

const GroupVideoPlayer: React.FC<GroupVideoPlayerProps> = ({ groupId, video }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Video[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // 🔍 Handle YouTube Search
  const handleSearch = async () => {
    if (searchQuery.trim()) {
      const results = await searchVideos(searchQuery);
      setSearchResults(results);
    }
  };

  // 💬 Send Chat Message
  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const message = {
      id: Date.now().toString(),
      userName: "Current User",
      text: newMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Top Navbar */}
      <header className="flex items-center bg-gray-800 px-4 py-2">
        <h1 className="text-xl font-bold text-red-500 mr-6">YouGroup</h1>
        <div className="flex-1 flex">
          <input
            type="text"
            className="w-full p-2 rounded-l-md bg-gray-700 text-white outline-none"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="px-4 bg-gray-600 rounded-r-md hover:bg-gray-500"
          >
            🔍
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Video + Recommended */}
        <main className="flex-1 flex flex-col p-4 overflow-y-auto">
          {/* Player */}
          {video ? (
            <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow">
              <iframe
                src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                title={video.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="w-full aspect-video bg-gray-800 flex items-center justify-center rounded-lg">
              <p className="text-gray-400">Search and select a video to play</p>
            </div>
          )}

          {/* Video Title */}
          {video && (
            <h2 className="mt-4 text-lg font-semibold">{video.title}</h2>
          )}

          {/* Recommended / Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-6">
              <h3 className="text-white font-semibold mb-3">Recommended</h3>
              <div className="space-y-3">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="flex gap-3 cursor-pointer hover:bg-gray-800 p-2 rounded-lg"
                    onClick={() => {
                      window.location.reload(); // Replace with state update to change playing video
                    }}
                  >
                    <img
                      src={result.thumbnail}
                      alt={result.title}
                      className="w-40 rounded-lg"
                    />
                    <div>
                      <p className="text-white text-sm font-medium line-clamp-2">
                        {result.title}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {result.channelTitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Live Chat */}
        <aside className="w-96 border-l border-gray-800 flex flex-col bg-gray-850">
          <div className="p-3 border-b border-gray-700">
            <h4 className="font-semibold text-white">Live Chat</h4>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center mt-10">No messages yet</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="text-sm">
                  <span className="text-indigo-400 font-medium mr-2">
                    {msg.userName}:
                  </span>
                  <span>{msg.text}</span>
                </div>
              ))
            )}
          </div>
          <div className="p-3 border-t border-gray-700 flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Say something..."
              className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="px-3 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 flex items-center justify-center"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default GroupVideoPlayer;
