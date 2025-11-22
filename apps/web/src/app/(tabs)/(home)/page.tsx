"use client";

import { useFarcaster } from "@/contexts/miniapp-context";
import { useState, useEffect, useMemo } from "react";
import { useAccount, useConnect } from "wagmi";
// added components from AI Generated code
import Header from "@/components/Header";
import ContentCard from "@/components/ContentCard";
import CategoryFilter from "@/components/CategoryFilter";
import { Button } from "@/components/ui/button";
import type { CategoryType } from "@/components/CategoryFilter";

// Added interface from AI Generated code
interface ContentItem {
  id: number;
  title: string;
  creator: string;
  image: string;
  supporters: number;
  description: string;
  avatarUrl: string;
  category: CategoryType;
}

const contentItems: ContentItem[] = [
  {
    id: 1,
    title: "Digital Art Masterclass",
    creator: "Alex Rivers",
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=450&fit=crop",
    supporters: 1234,
    description:
      "Learn advanced digital painting techniques and create stunning artwork with professional tips and tricks.",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    category: "art",
  },
  {
    id: 2,
    title: "Web3 Development Guide",
    creator: "Sarah Chen",
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=450&fit=crop",
    supporters: 892,
    description:
      "Complete guide to building decentralized applications on blockchain with hands-on projects.",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    category: "tech",
  },
  {
    id: 3,
    title: "Music Production Secrets",
    creator: "Jordan Smith",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=450&fit=crop",
    supporters: 2456,
    description:
      "Behind the scenes of hit music production. Learn mixing, mastering, and composition from a pro.",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
    category: "music",
  },
  {
    id: 4,
    title: "Creative Writing Workshop",
    creator: "Maya Johnson",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=450&fit=crop",
    supporters: 678,
    description:
      "Unlock your storytelling potential with weekly writing prompts and community feedback sessions.",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
    category: "writing",
  },
  {
    id: 5,
    title: "3D Animation Studio",
    creator: "Chris Park",
    image:
      "https://images.unsplash.com/photo-1633354994836-31e9771ec854?w=800&h=450&fit=crop",
    supporters: 1567,
    description:
      "Master 3D modeling and animation with Blender. From basics to advanced character rigging.",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chris",
    category: "video",
  },
  {
    id: 6,
    title: "Photography Masterpieces",
    creator: "Emma Wilson",
    image:
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=450&fit=crop",
    supporters: 3421,
    description:
      "Explore the art of photography through exclusive tutorials, critiques, and location shoots.",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    category: "art",
  },
  {
    id: 7,
    title: "Smart Contract Security",
    creator: "Dev Martinez",
    image:
      "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&h=450&fit=crop",
    supporters: 1123,
    description:
      "Learn to audit and secure smart contracts on Ethereum and other blockchains.",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dev",
    category: "tech",
  },
  {
    id: 8,
    title: "Indie Game Dev Journey",
    creator: "Sam Taylor",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=450&fit=crop",
    supporters: 2890,
    description:
      "Follow my journey creating indie games from concept to launch with Unity and Unreal.",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
    category: "video",
  },
];

export default function Home() {
  const { context, isMiniAppReady } = useFarcaster();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  // Wallet connection hooks
  const { isConnected, isConnecting } = useAccount();
  const { connect, connectors } = useConnect();

  // Auto-connect wallet when miniapp is ready
  useEffect(() => {
    if (
      isMiniAppReady &&
      !isConnected &&
      !isConnecting &&
      connectors.length > 0
    ) {
      const farcasterConnector = connectors.find((c) => c.id === "farcaster");
      if (farcasterConnector) {
        connect({ connector: farcasterConnector });
      }
    }
  }, [isMiniAppReady, isConnected, isConnecting, connectors, connect]);

  const filteredContent = useMemo(() => {
    let filtered = contentItems;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.creator.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  if (!isMiniAppReady) {
    return (
      <main className="flex-1">
        <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="w-full max-w-md mx-auto p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* <Header onSearchChange={setSearchQuery} searchValue={searchQuery} /> */}

      <main className="container px-4 py-6 md:px-6 md:py-8">
        <section className="mb-6">
          <h1 className="mb-2 text-2xl font-bold text-foreground md:text-3xl lg:text-4xl">
            Discover Creators
          </h1>
          <p className="text-muted-foreground md:text-lg mb-6">
            Support amazing creators and get exclusive content
          </p>

          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
          {filteredContent.map((item) => (
            <ContentCard key={item.id} {...item} />
          ))}
        </section>

        {filteredContent.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-lg text-muted-foreground">
              {searchQuery
                ? `No creators found for "${searchQuery}"`
                : "No creators found in this category"}
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-4 rounded-2xl"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
