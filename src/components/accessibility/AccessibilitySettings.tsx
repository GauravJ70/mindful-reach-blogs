
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Settings } from "lucide-react";

const AccessibilitySettings = () => {
  const { setTheme, theme, highContrast, setHighContrast, largeText, setLargeText } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Accessibility Settings">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Accessibility Settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Accessibility Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          <div className="mb-2">
            <p className="text-sm font-medium mb-1">Color Theme</p>
            <div className="flex gap-2">
              <Button 
                variant={theme === "light" ? "default" : "outline"} 
                size="sm"
                onClick={() => setTheme("light")}
                aria-pressed={theme === "light"}
                className="flex-1 h-8"
              >
                Light
              </Button>
              <Button 
                variant={theme === "dark" ? "default" : "outline"} 
                size="sm"
                onClick={() => setTheme("dark")}
                aria-pressed={theme === "dark"}
                className="flex-1 h-8"
              >
                Dark
              </Button>
            </div>
          </div>
          <DropdownMenuItem className="p-0 focus:bg-transparent hover:bg-transparent cursor-default">
            <div className="flex items-center justify-between py-2 w-full">
              <span className="text-sm">High Contrast</span>
              <Switch 
                checked={highContrast} 
                onCheckedChange={setHighContrast}
                aria-label="Toggle high contrast mode"
              />
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0 focus:bg-transparent hover:bg-transparent cursor-default">
            <div className="flex items-center justify-between py-2 w-full">
              <span className="text-sm">Large Text</span>
              <Switch 
                checked={largeText} 
                onCheckedChange={setLargeText}
                aria-label="Toggle large text mode"
              />
            </div>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccessibilitySettings;
