import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Language = "en" | "es" | "fr" | "de" | "ja" | "zh";

interface LanguageSelectorProps {
  value: Language;
  onValueChange: (value: Language) => void;
}

const languages: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "ja", label: "日本語" },
  { value: "zh", label: "中文" },
];

const LanguageSelector = ({ value, onValueChange }: LanguageSelectorProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[140px] rounded-2xl border-border bg-card">
        <Globe className="mr-2 h-4 w-4" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="rounded-2xl bg-popover border-border z-50">
        {languages.map((lang) => (
          <SelectItem
            key={lang.value}
            value={lang.value}
            className="rounded-xl cursor-pointer"
          >
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
export { languages };
