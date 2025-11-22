"use client"

import { useState } from "react"
import {
  BadgeCheck,
  Copy,
  Globe,
  Twitter,
  LayoutGrid,
  ImageIcon,
  Users,
  Wallet,
  MoreHorizontal,
  Share2,
  Lock,
  MessageSquare,
  Heart,
  Repeat,
  Zap,
  Gem,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export default function Web3ArtistProfile() {
  const [activeTab, setActiveTab] = useState("posts")
  const [isFollowing, setIsFollowing] = useState(false)

  // Explicit branding colors from request
  const brandOrange = "#fd852e"
  const brandPurple = "#a093a6"

  const tiers = [
    {
      name: "Supporter",
      price: "0.01 ETH",
      period: "/ month",
      description: "Support my creative journey and get access to exclusive updates.",
      features: ["Early access to drops", "Supporter badge", "Discord role"],
      color: "bg-zinc-100 dark:bg-zinc-900",
    },
    {
      name: "Collector",
      price: "0.05 ETH",
      period: "/ month",
      description: "For serious collectors. Get whitelisted for all future mints.",
      features: ["All Supporter perks", "Guaranteed Allowlist", "1 Free Mint / month", "Private telegram"],
      color: "bg-zinc-100 dark:bg-zinc-900 border-primary/50", // Highlighted
    },
    {
      name: "Whale",
      price: "0.5 ETH",
      period: "/ month",
      description: "Direct access and executive producer credits on all work.",
      features: ["All Collector perks", "1-on-1 Strategy Call", "Custom Commission", "Governance rights"],
      color: "bg-gradient-to-b from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-950",
    },
  ]

  const posts = [
    {
      id: 1,
      author: "Alex Rivera",
      handle: "@arivera.eth",
      avatar: "/artist-avatar.jpg",
      content:
        "Just finished the final render for the 'Neon Horizon' collection. Dropping tomorrow for all Collector tier members! 🎨✨",
      image: "/neon-cyberpunk-art.jpg",
      likes: 245,
      comments: 42,
      shares: 12,
      locked: false,
      timestamp: "2h ago",
    },
    {
      id: 2,
      author: "Alex Rivera",
      handle: "@arivera.eth",
      avatar: "/artist-avatar.jpg",
      content:
        "Exclusive WIP: Sketches for the upcoming utility token integration. Let me know what you think in the comments.",
      image: "/sketch-diagram.jpg",
      likes: 89,
      comments: 156,
      shares: 4,
      locked: true,
      tier: "Collector",
      timestamp: "5h ago",
    },
    {
      id: 3,
      author: "Alex Rivera",
      handle: "@arivera.eth",
      avatar: "/artist-avatar.jpg",
      content: "Thank you to everyone who minted 'Genesis #004'. We hit 100 ETH volume on secondary today! 🚀",
      likes: 1205,
      comments: 89,
      shares: 450,
      locked: false,
      timestamp: "1d ago",
    },
  ]

  const nfts = [
    { id: 1, title: "Genesis #001", image: "/abstract-nft-1.jpg" },
    { id: 2, title: "Genesis #002", image: "/abstract-nft-2.jpg" },
    { id: 3, title: "Genesis #003", image: "/abstract-nft-3.jpg" },
    { id: 4, title: "Genesis #004", image: "/abstract-nft-4.jpg" },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Cover Image */}
      <div className="h-48 md:h-64 w-full bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 right-4 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm border-none"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
        {/* Profile Header Info */}
        <div className="flex flex-col md:flex-row items-start md:items-end gap-4 -mt-16 md:-mt-20 mb-8">
          <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-background shadow-xl">
            <AvatarImage src="/avatar-3d.jpg" alt="Profile" />
            <AvatarFallback>AR</AvatarFallback>
          </Avatar>

          <div className="flex-1 mt-2 md:mb-2 space-y-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-bold font-sans">Alex Rivera</h1>
                  <BadgeCheck className="h-6 w-6 text-primary fill-primary/20" />
                </div>
                <p className="text-muted-foreground font-medium">@arivera.eth</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`rounded-full font-semibold transition-all ${isFollowing ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
                <Button variant="outline" className="rounded-full border-muted-foreground/30 bg-transparent">
                  <Wallet className="mr-2 h-4 w-4" />
                  Tip
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bio & Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-4">
              <p className="text-lg leading-relaxed">
                Digital artist & creative technologist exploring the intersection of AI, blockchain, and generative art.
                Building the future of decentralized creativity.
              </p>

              <div className="flex flex-wrap gap-4 text-sm font-medium text-muted-foreground">
                <div className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer">
                  <Globe className="h-4 w-4" />
                  alexrivera.xyz
                </div>
                <div className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer">
                  <Twitter className="h-4 w-4" />
                  @alex_rivera
                </div>
                <div className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer bg-secondary/10 px-2 py-0.5 rounded-full text-secondary-foreground">
                  <Copy className="h-3.5 w-3.5" />
                  0x71C...9A23
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-4 border-y border-border/50">
              <div className="text-center md:text-left">
                <div className="text-2xl font-bold font-sans">12.5k</div>
                <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Followers</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-2xl font-bold font-sans">482</div>
                <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Patrons</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-2xl font-bold font-sans flex items-center justify-center md:justify-start gap-1">
                  <Zap className="h-5 w-5 text-primary" />
                  84 ETH
                </div>
                <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Vol Traded</div>
              </div>
            </div>
          </div>

          {/* Featured/Latest NFT Card (Sidebar on desktop) */}
          <div className="hidden md:block">
            <Card className="overflow-hidden border-border/60 bg-card/50 backdrop-blur-sm">
              <div className="aspect-square relative">
                <img src="/featured-nft.jpg" alt="Featured" className="object-cover w-full h-full" />
                <Badge className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 backdrop-blur-md">
                  Latest Drop
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-1">Genesis #005</h3>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-muted-foreground">Current Bid</p>
                    <p className="font-bold text-primary">2.4 ETH</p>
                  </div>
                  <Button
                    size="sm"
                    className="rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  >
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Membership Tiers - Horizontal Scroll on Mobile */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Gem className="h-5 w-5 text-primary" />
              Membership Tiers
            </h2>
          </div>

          <ScrollArea className="w-full whitespace-nowrap pb-4">
            <div className="flex gap-4">
              {tiers.map((tier) => (
                <Card
                  key={tier.name}
                  className={`w-[280px] md:w-[300px] shrink-0 border-border/60 shadow-sm transition-all hover:shadow-md ${tier.color ? tier.color : ""}`}
                >
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">{tier.name}</CardTitle>
                    <CardDescription className="text-muted-foreground font-medium">
                      <span className="text-2xl font-bold text-foreground">{tier.price}</span>
                      {tier.period}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground whitespace-normal min-h-[40px]">{tier.description}</p>
                    <ul className="space-y-2">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm font-medium">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full rounded-full font-bold shadow-none">Join {tier.name}</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="hidden" />
          </ScrollArea>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="posts" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start border-b border-border/50 bg-transparent rounded-none h-auto p-0 mb-6 gap-6">
            <TabsTrigger
              value="posts"
              className="rounded-none border-b-2 border-transparent px-2 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-bold text-muted-foreground data-[state=active]:text-foreground text-base transition-all"
            >
              <LayoutGrid className="mr-2 h-4 w-4" />
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="nfts"
              className="rounded-none border-b-2 border-transparent px-2 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-bold text-muted-foreground data-[state=active]:text-foreground text-base transition-all"
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Gallery
            </TabsTrigger>
            <TabsTrigger
              value="community"
              className="rounded-none border-b-2 border-transparent px-2 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none font-bold text-muted-foreground data-[state=active]:text-foreground text-base transition-all"
            >
              <Users className="mr-2 h-4 w-4" />
              Community
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-6 animate-in fade-in-50 duration-500">
            {posts.map((post) => (
              <Card key={post.id} className="border-border/60 overflow-hidden bg-card/50 backdrop-blur-sm">
                <CardContent className="p-0">
                  <div className="p-4 sm:p-6">
                    <div className="flex gap-3 mb-4">
                      <Avatar>
                        <AvatarImage src={post.avatar || "/placeholder.svg"} />
                        <AvatarFallback>AR</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm">{post.author}</p>
                          <span className="text-muted-foreground text-sm">• {post.timestamp}</span>
                        </div>
                        <p className="text-muted-foreground text-sm">{post.handle}</p>
                      </div>
                    </div>

                    <p className="mb-4 text-base leading-relaxed">{post.content}</p>
                  </div>

                  {post.image && (
                    <div className="relative">
                      {post.locked ? (
                        <div className="relative aspect-video w-full overflow-hidden bg-muted">
                          <img
                            src={post.image || "/placeholder.svg"}
                            alt="Locked content"
                            className="w-full h-full object-cover blur-xl opacity-50"
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/20">
                            <div className="bg-background/80 backdrop-blur-md p-6 rounded-2xl shadow-lg max-w-sm w-full border border-primary/20">
                              <Lock className="h-8 w-8 text-primary mx-auto mb-3" />
                              <h3 className="font-bold text-lg mb-1">Members Only</h3>
                              <p className="text-muted-foreground text-sm mb-4">
                                Join the {post.tier} tier to unlock this post.
                              </p>
                              <Button className="w-full rounded-full font-bold">Unlock Access</Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="aspect-video w-full overflow-hidden bg-muted">
                          <img
                            src={post.image || "/placeholder.svg"}
                            alt="Post content"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-4 flex items-center justify-between border-t border-border/50">
                    <div className="flex gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full gap-1.5"
                      >
                        <Heart className="h-4 w-4" />
                        <span className="text-xs font-semibold">{post.likes}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full gap-1.5"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span className="text-xs font-semibold">{post.comments}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full gap-1.5"
                      >
                        <Repeat className="h-4 w-4" />
                        <span className="text-xs font-semibold">{post.shares}</span>
                      </Button>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="nfts" className="animate-in fade-in-50 duration-500">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {nfts.map((nft) => (
                <Card
                  key={nft.id}
                  className="overflow-hidden border-border/60 hover:border-primary/50 transition-colors cursor-pointer group"
                >
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img
                      src={nft.image || "/placeholder.svg"}
                      alt={nft.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-sm truncate">{nft.title}</h4>
                    <p className="text-xs text-muted-foreground">0.45 ETH</p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="community" className="animate-in fade-in-50 duration-500">
            <Card className="text-center py-12 border-dashed border-2">
              <CardContent>
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">Member Community</h3>
                <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                  Join 482 other patrons in the private Discord server and governance forum.
                </p>
                <Button className="rounded-full font-bold">Connect Discord</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
