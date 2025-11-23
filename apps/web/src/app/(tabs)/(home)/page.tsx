"use client";

import { useFarcaster } from "@/contexts/miniapp-context";
import { useState, useMemo } from "react";
import ContentCard from "@/components/ContentCard";
import CategoryFilter from "@/components/CategoryFilter";
import { Button } from "@/components/ui/button";
import type { CategoryType } from "@/components/CategoryFilter";
import { useQuery } from "convex/react";
import { api } from "@/backend/_generated/api";

// Added interface from AI Generated code
interface ContentItem {
  id: string | number;
  title: string;
  creator: string;
  image: string;
  supporters: number;
  description: string;
  avatarUrl: string;
  category: CategoryType;
}

export default function Home() {
  const { isMiniAppReady } = useFarcaster();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const posts = useQuery(api.posts.get);

  const contentItems: ContentItem[] = useMemo(() => {
    if (!posts) return [];

    return posts.map((post: any) => {
      const creator = post.creator;
      const user = creator.user;
      const body = post.body;

      let title = "Post";
      let description = "";
      let image = creator.coverImageUrl || "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=450&fit=crop";

      if (body.type === "text") {
        title = body.content.slice(0, 50) + (body.content.length > 50 ? "..." : "");
        description = body.content;
      } else if (body.type === "image") {
        title = body.caption || "Image";
        description = body.caption || "";
        image = `https://ipfs.io/ipfs/${body.filecoinCid}`;
      } else if (body.type === "video") {
        title = body.description || "Video";
        description = body.description || "";
        image = body.thumbnailUrl || `https://ipfs.io/ipfs/${body.filecoinCid}`;
      }

      const categoryRaw = creator.categories[0]?.toLowerCase() || "other";
      const category: CategoryType = ["art", "music", "tech", "writing", "video"].includes(categoryRaw)
        ? (categoryRaw as CategoryType)
        : "other";

      return {
        id: post._id,
        title,
        creator: user.displayName || user.username,
        image,
        supporters: post.stats.likeCount,
        description,
        avatarUrl: user.pfpUrl,
        category,
      };
    });
  }, [posts]);

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
  }, [selectedCategory, searchQuery, contentItems]);

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
