"use client";
import { useMiniApp } from "@/contexts/miniapp-context";
import { sdk } from "@farcaster/frame-sdk";
import { useState, useEffect, useMemo } from "react";
import { useAccount, useConnect } from "wagmi";
// added components from AI Generated code
import Header from "@/components/Header";
import ContentCard from "@/components/ContentCard";
import CategoryFilter from "@/components/CategoryFilter";
import { Button } from "@/components/ui/button";
import type { CategoryType } from "@/components/CategoryFilter";
import creatorHero from "@/assets/creator-hero.jpg";

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

export default function Home() {
  const { context, isMiniAppReady } = useMiniApp();
  const [isAddingMiniApp, setIsAddingMiniApp] = useState(false);
  const [addMiniAppMessage, setAddMiniAppMessage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  // Wallet connection hooks
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors } = useConnect();

  // Auto-connect wallet when miniapp is ready
  useEffect(() => {
    if (isMiniAppReady && !isConnected && !isConnecting && connectors.length > 0) {
      const farcasterConnector = connectors.find(c => c.id === 'farcaster');
      if (farcasterConnector) {
        connect({ connector: farcasterConnector });
      }
    }
  }, [isMiniAppReady, isConnected, isConnecting, connectors, connect]);

  // Extract user data from context
  const user = context?.user;
  // Use connected wallet address if available, otherwise fall back to user custody/verification
  const walletAddress = address || user?.custody || user?.verifications?.[0] || "0x1e4B...605B";
  const displayName = user?.displayName || user?.username || "User";
  const username = user?.username || "@user";
  const pfpUrl = user?.pfpUrl;

  const contentItems: ContentItem[] = [
    {
      id: 1,
      title: "Digital Art Masterclass",
      creator: "Alex Rivers",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=450&fit=crop",
      supporters: 1234,
      description: "Learn advanced digital painting techniques and create stunning artwork with professional tips and tricks.",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      category: "art",
    },
    {
      id: 2,
      title: "Web3 Development Guide",
      creator: "Sarah Chen",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=450&fit=crop",
      supporters: 892,
      description: "Complete guide to building decentralized applications on blockchain with hands-on projects.",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      category: "tech",
    },
    {
      id: 3,
      title: "Music Production Secrets",
      creator: "Jordan Smith",
      image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=450&fit=crop",
      supporters: 2456,
      description: "Behind the scenes of hit music production. Learn mixing, mastering, and composition from a pro.",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
      category: "music",
    },
    {
      id: 4,
      title: "Creative Writing Workshop",
      creator: "Maya Johnson",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=450&fit=crop",
      supporters: 678,
      description: "Unlock your storytelling potential with weekly writing prompts and community feedback sessions.",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
      category: "writing",
    },
    {
      id: 5,
      title: "3D Animation Studio",
      creator: "Chris Park",
      image: "https://images.unsplash.com/photo-1633354994836-31e9771ec854?w=800&h=450&fit=crop",
      supporters: 1567,
      description: "Master 3D modeling and animation with Blender. From basics to advanced character rigging.",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chris",
      category: "video",
    },
    {
      id: 6,
      title: "Photography Masterpieces",
      creator: "Emma Wilson",
      image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=450&fit=crop",
      supporters: 3421,
      description: "Explore the art of photography through exclusive tutorials, critiques, and location shoots.",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      category: "art",
    },
    {
      id: 7,
      title: "Smart Contract Security",
      creator: "Dev Martinez",
      image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&h=450&fit=crop",
      supporters: 1123,
      description: "Learn to audit and secure smart contracts on Ethereum and other blockchains.",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dev",
      category: "tech",
    },
    {
      id: 8,
      title: "Indie Game Dev Journey",
      creator: "Sam Taylor",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=450&fit=crop",
      supporters: 2890,
      description: "Follow my journey creating indie games from concept to launch with Unity and Unreal.",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
      category: "video",
    },
  ];

  // Format wallet address to show first 6 and last 4 characters
  const formatAddress = (address: string) => {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

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
          item.description.toLowerCase().includes(query)
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
      <Header onSearchChange={setSearchQuery} searchValue={searchQuery} />

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
    // <main className="flex-1">
    //   <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    //     <div className="w-full max-w-md mx-auto p-8 text-center">
    //       {/* Welcome Header */}
    //       <h1 className="text-4xl font-bold text-gray-900 mb-4">
    //         Welcome
    //       </h1>

    //       {/* Status Message */}
    //       <p className="text-lg text-gray-600 mb-6">
    //         You are signed in!
    //       </p>

    //       {/* User Wallet Address */}
    //       <div className="mb-8">
    //         <div className="bg-white/20 backdrop-blur-sm px-4 py-3 rounded-lg">
    //           <div className="flex items-center justify-between mb-2">
    //             <span className="text-xs text-gray-600 font-medium">Wallet Status</span>
    //             <div className={`flex items-center gap-1 text-xs ${
    //               isConnected ? 'text-green-600' : isConnecting ? 'text-yellow-600' : 'text-gray-500'
    //             }`}>
    //               <div className={`w-2 h-2 rounded-full ${
    //                 isConnected ? 'bg-green-500' : isConnecting ? 'bg-yellow-500' : 'bg-gray-400'
    //               }`}></div>
    //               {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Disconnected'}
    //             </div>
    //           </div>
    //           <p className="text-sm text-gray-700 font-mono">
    //             {formatAddress(walletAddress)}
    //           </p>
    //         </div>
    //       </div>

    //       {/* User Profile Section */}
    //       <div className="mb-8">
    //         {/* Profile Avatar */}
    //         <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center overflow-hidden">
    //           {pfpUrl ? (
    //             <img 
    //               src={pfpUrl} 
    //               alt="Profile" 
    //               className="w-full h-full object-cover rounded-full"
    //             />
    //           ) : (
    //             <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
    //               <div className="w-3 h-3 bg-green-400 rounded-full"></div>
    //             </div>
    //           )}
    //         </div>

    //         {/* Profile Info */}
    //         <div>
    //           <h2 className="text-xl font-semibold text-gray-900 mb-1">
    //             {displayName}
    //           </h2>
    //           <p className="text-gray-500">
    //             {username.startsWith('@') ? username : `@${username}`}
    //           </p>
    //         </div>
    //       </div>

    //       {/* Add Miniapp Button */}
    //       <div className="mb-6">
    //         <button
    //           onClick={async () => {
    //             if (isAddingMiniApp) return;

    //             setIsAddingMiniApp(true);
    //             setAddMiniAppMessage(null);

    //             try {
    //               const result = await sdk.actions.addMiniApp();
    //               if ((result as any).added) {
    //                 setAddMiniAppMessage("✅ Miniapp added successfully!");
    //               } else {
    //                 setAddMiniAppMessage("ℹ️ Miniapp was not added (user declined or already exists)");
    //               }
    //             } catch (error: any) {
    //               console.error('Add miniapp error:', error);
    //               if (error?.message?.includes('domain')) {
    //                 setAddMiniAppMessage("⚠️ This miniapp can only be added from its official domain");
    //               } else {
    //                 setAddMiniAppMessage("❌ Failed to add miniapp. Please try again.");
    //               }
    //             } finally {
    //               setIsAddingMiniApp(false);
    //             }
    //           }}
    //           disabled={isAddingMiniApp}
    //           className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
    //         >
    //           {isAddingMiniApp ? (
    //             <>
    //               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
    //               Adding...
    //             </>
    //           ) : (
    //             <>
    //               <span>📱</span>
    //               Add Miniapp
    //             </>
    //           )}
    //         </button>

    //         {/* Add Miniapp Status Message */}
    //         {addMiniAppMessage && (
    //           <div className="mt-3 p-3 bg-white/30 backdrop-blur-sm rounded-lg">
    //             <p className="text-sm text-gray-700">{addMiniAppMessage}</p>
    //           </div>
    //         )}
    //       </div>
    //     </div>
    //   </section>
    // </main>
  );
}
/*
ADDED all interface components and layout from AI Generated code

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const contentItems: ContentItem[] = [
    {
      id: 1,
      title: "Digital Art Masterclass",
      creator: "Alex Rivers",
      image: creatorHero,
      supporters: 1234,
      description: "Learn advanced digital painting techniques and create stunning artwork with professional tips and tricks.",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      category: "art",
    },
    {
      id: 2,
      title: "Web3 Development Guide",
      creator: "Sarah Chen",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=450&fit=crop",
      supporters: 892,
      description: "Complete guide to building decentralized applications on blockchain with hands-on projects.",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      category: "tech",
    },
    {
      id: 3,
      title: "Music Production Secrets",
      creator: "Jordan Smith",
      image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=450&fit=crop",
      supporters: 2456,
      description: "Behind the scenes of hit music production. Learn mixing, mastering, and composition from a pro.",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
      category: "music",
    },
    {
      id: 4,
      title: "Creative Writing Workshop",
      creator: "Maya Johnson",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=450&fit=crop",
      supporters: 678,
      description: "Unlock your storytelling potential with weekly writing prompts and community feedback sessions.",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
      category: "writing",
    },
    {
      id: 5,
      title: "3D Animation Studio",
      creator: "Chris Park",
      image: "https://images.unsplash.com/photo-1633354994836-31e9771ec854?w=800&h=450&fit=crop",
      supporters: 1567,
      description: "Master 3D modeling and animation with Blender. From basics to advanced character rigging.",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chris",
      category: "video",
    },
    {
      id: 6,
      title: "Photography Masterpieces",
      creator: "Emma Wilson",
      image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=450&fit=crop",
      supporters: 3421,
      description: "Explore the art of photography through exclusive tutorials, critiques, and location shoots.",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      category: "art",
    },
    {
      id: 7,
      title: "Smart Contract Security",
      creator: "Dev Martinez",
      image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&h=450&fit=crop",
      supporters: 1123,
      description: "Learn to audit and secure smart contracts on Ethereum and other blockchains.",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dev",
      category: "tech",
    },
    {
      id: 8,
      title: "Indie Game Dev Journey",
      creator: "Sam Taylor",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=450&fit=crop",
      supporters: 2890,
      description: "Follow my journey creating indie games from concept to launch with Unity and Unreal.",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
      category: "video",
    },
  ];

  // Filter content based on selected category and search query
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
          item.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Header onSearchChange={setSearchQuery} searchValue={searchQuery} />

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
};

export default Index;
*/
