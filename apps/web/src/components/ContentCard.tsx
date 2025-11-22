import { Heart, Users } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { CategoryType } from "./CategoryFilter";

interface ContentCardProps {
  title: string;
  creator: string;
  image: string;
  supporters: number;
  description: string;
  avatarUrl?: string;
  category: CategoryType;
}

const ContentCard = ({ title, creator, image, supporters, description, avatarUrl, category }: ContentCardProps) => {
  return (
    <Card className="group overflow-hidden rounded-3xl border-border transition-all hover:shadow-lg hover:shadow-primary/10">
      <CardHeader className="p-0">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </CardHeader>

      <CardContent className="p-4 md:p-5">
        <div className="mb-3 flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-border">
            <AvatarImage src={avatarUrl} alt={creator} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {creator.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-foreground text-base md:text-lg truncate">{title}</h3>
            <p className="text-sm text-muted-foreground truncate">{creator}</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{description}</p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span className="font-semibold">{supporters}</span>
            <span className="hidden sm:inline">supporters</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 md:p-5 md:pt-0">
        <Button className="w-full rounded-2xl font-semibold transition-all hover:shadow-md">
          <Heart className="mr-2 h-4 w-4" />
          Support Creator
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ContentCard;
