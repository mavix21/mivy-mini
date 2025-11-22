import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Palette, Music, Code, Pen, Video, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type CategoryType = "all" | "art" | "music" | "tech" | "writing" | "video" | "other";

interface Category {
  id: CategoryType;
  label: string;
  icon: LucideIcon;
}

interface CategoryFilterProps {
  selectedCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
}

const categories: Category[] = [
  { id: "all", label: "All", icon: Sparkles },
  { id: "art", label: "Art", icon: Palette },
  { id: "music", label: "Music", icon: Music },
  { id: "tech", label: "Tech", icon: Code },
  { id: "writing", label: "Writing", icon: Pen },
  { id: "video", label: "Video", icon: Video },
];

const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="w-full overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
      <div className="flex gap-2 min-w-max md:flex-wrap md:min-w-0">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = selectedCategory === category.id;
          
          return (
            <Button
              key={category.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category.id)}
              className={`
                rounded-2xl font-semibold whitespace-nowrap transition-all
                ${isActive 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "bg-card hover:bg-secondary/10 hover:text-secondary hover:border-secondary"
                }
              `}
            >
              <Icon className="mr-1.5 h-4 w-4" />
              {category.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;
export type { Category };
