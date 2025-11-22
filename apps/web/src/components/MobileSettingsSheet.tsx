import { Moon, Sun, Globe, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import LanguageSelector from "./LanguageSelector";
import type { Language } from "./LanguageSelector";

interface MobileSettingsSheetProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const MobileSettingsSheet = ({ language, onLanguageChange }: MobileSettingsSheetProps) => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-2xl transition-all hover:bg-muted lg:hidden"
          aria-label="Settings"
        >
          <SettingsIcon className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[350px] rounded-l-3xl">
        <SheetHeader>
          <SheetTitle className="text-left font-bold text-xl">Settings</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDark ? (
                <Moon className="h-5 w-5 text-primary" />
              ) : (
                <Sun className="h-5 w-5 text-primary" />
              )}
              <Label htmlFor="dark-mode" className="text-base font-semibold cursor-pointer">
                Dark Mode
              </Label>
            </div>
            <Switch
              id="dark-mode"
              checked={isDark}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
          </div>

          {/* Language Selector */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-primary" />
              <Label className="text-base font-semibold">Language</Label>
            </div>
            <LanguageSelector value={language} onValueChange={onLanguageChange} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSettingsSheet;
