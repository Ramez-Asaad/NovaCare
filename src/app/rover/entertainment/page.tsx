"use client";

import { useState } from "react";
import { Music, Video, Gamepad2, Radio, Heart, ArrowLeft, Play, Pause, SkipBack, SkipForward, Volume2, Book } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const categories = [
  { id: "music", name: "Music", icon: Music, color: "bg-purple-500" },
  { id: "video", name: "Videos", icon: Video, color: "bg-accent" },
  { id: "games", name: "Games", icon: Gamepad2, color: "bg-success" },
  { id: "radio", name: "Radio", icon: Radio, color: "bg-secondary" },
  { id: "stories", name: "Stories", icon: Book, color: "bg-indigo-500" },
];

const musicTracks = [
  { id: 1, title: "Relaxing Piano", artist: "Calm Sounds", duration: "4:32", mood: "relaxing" },
  { id: 2, title: "Morning Jazz", artist: "Smooth Jazz", duration: "5:17", mood: "upbeat" },
  { id: 3, title: "Nature Sounds", artist: "Ambient", duration: "10:00", mood: "relaxing" },
  { id: 4, title: "Classical Favorites", artist: "Orchestra", duration: "6:45", mood: "focus" },
  { id: 5, title: "Feel Good Hits", artist: "Various Artists", duration: "3:52", mood: "upbeat" },
];

const games = [
  { id: 1, name: "Memory Match", description: "Match the pairs", difficulty: "Easy", icon: "🧩" },
  { id: 2, name: "Word Puzzle", description: "Find hidden words", difficulty: "Medium", icon: "📝" },
  { id: 3, name: "Sudoku", description: "Number challenge", difficulty: "Hard", icon: "🔢" },
  { id: 4, name: "Trivia Quiz", description: "Test your knowledge", difficulty: "Easy", icon: "❓" },
];

export default function EntertainmentPage() {
  const [activeCategory, setActiveCategory] = useState("music");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<typeof musicTracks[0] | null>(null);

  const playTrack = (track: typeof musicTracks[0]) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/rover"
          className="rover-btn w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-text-secondary dark:text-gray-400" />
        </Link>
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary dark:text-white">Entertainment</h1>
          <p className="text-text-muted dark:text-gray-400">Music, videos, games, and more</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "rover-btn flex items-center gap-3 px-6 py-4 rounded-2xl transition-all whitespace-nowrap",
              activeCategory === cat.id
                ? `${cat.color} text-white`
                : "bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 text-text-secondary dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            )}
          >
            <cat.icon className="w-6 h-6" />
            <span className="text-lg font-semibold">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Music Section */}
      {activeCategory === "music" && (
        <div className="space-y-4">
          {/* Quick Moods */}
          <div className="flex gap-4">
            {["😌 Relaxing", "🎉 Upbeat", "🎯 Focus"].map((mood) => (
              <button
                key={mood}
                className="flex-1 py-4 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl text-lg font-medium text-text-primary dark:text-white hover:border-primary hover:text-primary transition-colors"
              >
                {mood}
              </button>
            ))}
          </div>

          {/* Track List */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-text-primary dark:text-white">Your Music</h2>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {musicTracks.map((track) => (
                <button
                  key={track.id}
                  onClick={() => playTrack(track)}
                  className={cn(
                    "w-full p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left",
                    currentTrack?.id === track.id && "bg-primary-50 dark:bg-primary-900/30"
                  )}
                >
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center",
                    currentTrack?.id === track.id && isPlaying ? "bg-primary" : "bg-purple-100 dark:bg-purple-900/50"
                  )}>
                    {currentTrack?.id === track.id && isPlaying ? (
                      <Pause className="w-6 h-6 text-white" />
                    ) : (
                      <Play className="w-6 h-6 text-purple-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-text-primary dark:text-white">{track.title}</h3>
                    <p className="text-text-muted dark:text-gray-400">{track.artist}</p>
                  </div>
                  <span className="text-text-muted dark:text-gray-400">{track.duration}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Games Section */}
      {activeCategory === "games" && (
        <div className="grid grid-cols-2 gap-4">
          {games.map((game) => (
            <button
              key={game.id}
              className="rover-card bg-white dark:bg-gray-800 rounded-3xl p-6 text-left border-2 border-gray-100 dark:border-gray-700 hover:border-success hover:shadow-lg transition-all"
            >
              <div className="text-5xl mb-4">{game.icon}</div>
              <h3 className="text-xl font-bold text-text-primary dark:text-white mb-1">{game.name}</h3>
              <p className="text-text-muted dark:text-gray-400 mb-3">{game.description}</p>
              <span className={cn(
                "px-3 py-1 rounded-full text-sm font-medium",
                game.difficulty === "Easy" ? "bg-success-100 dark:bg-success-900/50 text-success" :
                game.difficulty === "Medium" ? "bg-secondary-100 dark:bg-secondary-900/50 text-secondary" :
                "bg-accent-100 dark:bg-accent-900/50 text-accent"
              )}>
                {game.difficulty}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Video Section */}
      {activeCategory === "video" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {["Nature Documentaries", "Cooking Shows", "Comedy Clips", "Travel Videos"].map((category) => (
              <button
                key={category}
                className="rover-card bg-gradient-to-br from-gray-700 to-gray-900 rounded-3xl p-8 text-white text-left hover:scale-[1.02] transition-all"
              >
                <Video className="w-10 h-10 mb-4 opacity-60" />
                <h3 className="text-xl font-bold">{category}</h3>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Radio Section */}
      {activeCategory === "radio" && (
        <div className="space-y-4">
          {["Jazz FM", "Classical Radio", "News Talk", "Oldies Station"].map((station) => (
            <button
              key={station}
              className="w-full p-6 bg-white rounded-2xl border-2 border-gray-100 flex items-center gap-4 hover:border-secondary transition-colors"
            >
              <div className="w-14 h-14 bg-secondary-100 rounded-2xl flex items-center justify-center">
                <Radio className="w-6 h-6 text-secondary" />
              </div>
              <span className="text-xl font-semibold text-text-primary">{station}</span>
            </button>
          ))}
        </div>
      )}

      {/* Stories Section */}
      {activeCategory === "stories" && (
        <div className="space-y-4">
          {["Bedtime Stories", "Audiobooks", "Podcasts", "Meditation"].map((type) => (
            <button
              key={type}
              className="w-full p-6 bg-white rounded-2xl border-2 border-gray-100 flex items-center gap-4 hover:border-indigo-500 transition-colors"
            >
              <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center">
                <Book className="w-6 h-6 text-indigo-500" />
              </div>
              <span className="text-xl font-semibold text-text-primary">{type}</span>
            </button>
          ))}
        </div>
      )}

      {/* Now Playing Bar */}
      {currentTrack && (
        <div className="fixed bottom-24 left-0 right-0 px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-4 shadow-elevated flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold">{currentTrack.title}</h3>
              <p className="text-white/60 text-sm">{currentTrack.artist}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-3 hover:bg-white/10 rounded-xl transition-colors">
                <SkipBack className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-4 bg-white rounded-xl hover:bg-gray-100 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-purple-600" />
                ) : (
                  <Play className="w-6 h-6 text-purple-600" />
                )}
              </button>
              <button className="p-3 hover:bg-white/10 rounded-xl transition-colors">
                <SkipForward className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
