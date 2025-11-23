"use client";
import { useEffect, useState } from "react";
import { useConvexAuth, useMutation } from "convex/react";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Code,
  LinkIcon,
  ImageIcon,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthGateDialog } from "./auth-gate-dialog.context";
import Link from "next/link";
import { api } from "@/backend/_generated/api";

export function PostCreationLayout() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { open } = useAuthGateDialog();
  const createPost = useMutation(api.posts.create);

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      open({ key: "createPost" });
    }
  }, [isAuthenticated, isLoading, open]);

  const handlePublish = async () => {
    if (!content) return;
    
    setIsSubmitting(true);
    try {
      await createPost({
        title,
        summary,
        content,
        type: "text",
      });
      // Redirect to home or show success
      window.location.href = "/";
    } catch (error) {
      console.error("Failed to publish post:", error);
      // Ideally show a toast here
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-muted-foreground">
        Checking authentication...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center px-6 text-center text-muted-foreground">
        Sign in to create a post.
      </div>
    );
  }

  // Auto-resize textarea logic could go here, but for a clean UI we'll use CSS-based sizing or simple textareas

  return (
    <div className="flex flex-col h-screen bg-white text-black">
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-14 border-b border-gray-100 shrink-0">
        <Link
          href="/"
          className="text-gray-600 hover:bg-gray-50 h-auto p-2 font-normal"
        >
          Close
        </Link>

        <Button variant="ghost" size="icon" className="text-gray-600">
          <MoreHorizontal className="h-5 w-5" />
          <span className="sr-only">More options</span>
        </Button>

        <Button 
          className="rounded-md px-4 py-1.5 h-auto"
          onClick={handlePublish}
          disabled={isSubmitting || !content}
        >
          {isSubmitting ? "Publishing..." : "Publish"}
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8 space-y-4">
          {/* Title Input */}
          <div className="group">
            <textarea
              placeholder="Title"
              className="w-full text-4xl font-bold text-gray-300 placeholder:text-gray-300 focus:text-gray-900 outline-none resize-none bg-transparent overflow-hidden"
              rows={1}
              style={{ minHeight: "3rem" }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onInput={(e) => {
                // Simple auto-grow
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = target.scrollHeight + "px";
              }}
            />
          </div>

          {/* Summary Input */}
          <div className="group">
            <textarea
              placeholder="Write a brief summary..."
              className="w-full text-lg text-gray-500 placeholder:text-gray-400 outline-none resize-none bg-transparent"
              rows={1}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = target.scrollHeight + "px";
              }}
            />
          </div>

          {/* Body Input */}
          <div className="pt-4">
            <textarea
              placeholder="Tell your story..."
              className="w-full text-lg text-gray-800 placeholder:text-gray-300 outline-none resize-none bg-transparent min-h-[300px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = target.scrollHeight + "px";
              }}
            />
          </div>
        </div>
      </main>

      {/* Footer Toolbar */}
      <footer className="flex items-center px-4 py-3 border-t border-gray-100 bg-white shrink-0 gap-1 sm:gap-2 overflow-x-auto">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-gray-900 hover:bg-gray-50 shrink-0"
        >
          <Bold className="h-5 w-5" strokeWidth={2.5} />
          <span className="sr-only">Bold</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-gray-900 hover:bg-gray-50 shrink-0"
        >
          <Italic className="h-5 w-5" />
          <span className="sr-only">Italic</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-gray-900 hover:bg-gray-50 shrink-0"
        >
          <Strikethrough className="h-5 w-5" />
          <span className="sr-only">Strikethrough</span>
        </Button>

        <div className="h-6 w-px bg-gray-200 mx-1 shrink-0" />

        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-gray-900 hover:bg-gray-50 shrink-0"
        >
          <List className="h-5 w-5" />
          <span className="sr-only">Bullet list</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-gray-900 hover:bg-gray-50 shrink-0"
        >
          <ListOrdered className="h-5 w-5" />
          <span className="sr-only">Numbered list</span>
        </Button>

        <div className="h-6 w-px bg-gray-200 mx-1 shrink-0" />

        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-gray-900 hover:bg-gray-50 shrink-0"
        >
          <Code className="h-5 w-5" />
          <span className="sr-only">Code</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-gray-900 hover:bg-gray-50 shrink-0"
        >
          <LinkIcon className="h-5 w-5" />
          <span className="sr-only">Link</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-gray-900 hover:bg-gray-50 shrink-0"
        >
          <ImageIcon className="h-5 w-5" />
          <span className="sr-only">Image</span>
        </Button>
      </footer>
    </div>
  );
}
