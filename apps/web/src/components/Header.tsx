import { User, Sparkles, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTheme } from "next-themes";
import SearchBar from "./SearchBar";
import LanguageSelector from "./LanguageSelector";
import MobileSettingsSheet from "./MobileSettingsSheet";
import type { Language } from "./LanguageSelector";

interface HeaderProps {
  onSearchChange?: (value: string) => void;
  searchValue?: string;
}

const Header = ({ onSearchChange, searchValue = "" }: HeaderProps) => {
  const [isCreatorMode, setIsCreatorMode] = useState(false);
  const [language, setLanguage] = useState<Language>("en");
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="hidden sm:inline text-xl font-bold text-foreground">CreatorChain</span>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-md">
          <SearchBar
            value={searchValue}
            onChange={(value) => onSearchChange?.(value)}
            placeholder="Search creators..."
          />
        </div>

        {/* Desktop Controls */}
        <nav className="hidden lg:flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-2xl transition-all hover:bg-muted"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Language Selector */}
          <LanguageSelector value={language} onValueChange={setLanguage} />

          {/* Profile */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-2xl transition-all hover:bg-muted"
            aria-label="Profile"
          >
            <User className="h-5 w-5" />
          </Button>

          {/* Creator Mode */}
          <Button
            variant={isCreatorMode ? "default" : "outline"}
            onClick={() => setIsCreatorMode(!isCreatorMode)}
            className="rounded-2xl font-semibold transition-all"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Creator Mode
          </Button>
        </nav>

        {/* Mobile Controls */}
        <nav className="flex lg:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-2xl transition-all hover:bg-muted"
            aria-label="Profile"
          >
            <User className="h-5 w-5" />
          </Button>

          <Button
            variant={isCreatorMode ? "default" : "outline"}
            onClick={() => setIsCreatorMode(!isCreatorMode)}
            className="rounded-2xl font-semibold transition-all"
            size="sm"
          >
            <Sparkles className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Creator</span>
          </Button>

          <MobileSettingsSheet language={language} onLanguageChange={setLanguage} />
        </nav>
      </div>

      {/* Mobile Search Bar */}
      <div className="lg:hidden border-t border-border px-4 py-3">
        <SearchBar
          value={searchValue}
          onChange={(value) => onSearchChange?.(value)}
          placeholder="Search creators..."
        />
      </div>
    </header>
  );
};

export default Header;
