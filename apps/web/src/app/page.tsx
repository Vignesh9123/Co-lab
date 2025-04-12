"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Headphones, Monitor, PenTool, Youtube } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-lg bg-background/80 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                Co-Lab
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost">Sign In</Button>
              <Button>Get Started</Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden pt-16">
        {/* Gradient Background */}
        <div className="absolute inset-0 w-full h-full dark:bg-black bg-white -z-10">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[800px] h-[800px] dark:bg-purple-500/20 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute w-[600px] h-[600px] dark:bg-pink-500/20 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute w-[400px] h-[400px] dark:bg-indigo-500/20 bg-violet-500/20 rounded-full blur-3xl animate-pulse delay-2000" />
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          {/* Hero Section */}
          <div className="text-center space-y-8">
            <div className="inline-block">
              <div className="inline-flex items-center justify-center px-4 py-1.5 border dark:border-gray-700 border-gray-300 rounded-full text-sm font-medium mb-8 backdrop-blur-sm">
                ✨ Introducing real-time collaboration for everyone
              </div>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r dark:from-purple-400 dark:via-pink-400 dark:to-indigo-400 from-purple-600 via-pink-600 to-indigo-600">
              Collaborate in real-time,
              <br />
              without boundaries
            </h1>
            <p className="max-w-2xl mx-auto text-xl dark:text-gray-400 text-gray-600">
              Join a room and instantly start collaborating with anyone. Share code, watch videos together, listen to music, draw, or just chat - all in perfect sync.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                Start Collaborating <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mt-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Code2 className="w-6 h-6" />}
              title="Code Together"
              description="Real-time code collaboration with syntax highlighting and live cursors."
            />
            <FeatureCard
              icon={<Youtube className="w-6 h-6" />}
              title="Watch Together"
              description="Synchronized YouTube playback with shared controls and chat."
            />
            <FeatureCard
              icon={<Headphones className="w-6 h-6" />}
              title="Listen Together"
              description="Share Spotify music and playlists in perfect harmony."
            />
            <FeatureCard
              icon={<PenTool className="w-6 h-6" />}
              title="Draw Together"
              description="Collaborative whiteboard for sketching and brainstorming."
            />
            <FeatureCard
              icon={<Monitor className="w-6 h-6" />}
              title="Screen Sharing"
              description="Share your screen with crystal clear quality and low latency."
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Co-Lab</h3>
              <p className="text-sm text-muted-foreground">
                Making real-time collaboration accessible for everyone.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Features</li>
                <li>Pricing</li>
                <li>Documentation</li>
                <li>Changelog</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Privacy</li>
                <li>Terms</li>
                <li>Cookie Policy</li>
                <li>Licenses</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Co-Lab. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r dark:from-purple-500/20 dark:to-pink-500/20 from-blue-500/20 to-cyan-500/20 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-1000"></div>
      <div className="relative p-6 backdrop-blur-sm bg-white/50 dark:bg-black/50 rounded-lg border dark:border-gray-800 border-gray-200">
        <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}