
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, X } from "lucide-react";
import AccessibilitySettings from "../accessibility/AccessibilitySettings";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search for:", searchValue);
    // Add search functionality here
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Blog", path: "/blog" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
    { label: "Author", path: "/author" },
  ];

  return (
    <header className="fixed w-full bg-background border-b z-20">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 no-underline"
            aria-label="MindfulReach Blog"
          >
            <span className="font-bold text-lg md:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blog-blue to-blog-blue-dark">
              MindfulReach
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6" aria-label="Main Navigation">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-base font-medium transition-colors hover:text-primary no-underline"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Search and Settings */}
          <div className="hidden md:flex items-center space-x-2">
            <form onSubmit={handleSearchSubmit} className="relative" role="search">
              <Input
                type="search"
                placeholder="Search articles..."
                className="w-[200px] lg:w-[300px]"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                aria-label="Search articles"
              />
              <Button 
                type="submit" 
                variant="ghost" 
                size="icon" 
                className="absolute right-0 top-0"
                aria-label="Submit search"
              >
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </form>
            <AccessibilitySettings />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
              aria-controls="mobile-menu"
              className="text-foreground"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-background border-b pb-4 animate-fade-in"
          role="navigation"
          aria-label="Mobile Navigation"
        >
          <div className="container px-4">
            <div className="py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="block py-2 px-3 text-base font-medium rounded-md hover:bg-accent no-underline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="pt-2 pb-3 space-y-4">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Input
                  type="search"
                  placeholder="Search articles..."
                  className="w-full"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  aria-label="Search articles"
                />
                <Button 
                  type="submit" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-0 top-0"
                  aria-label="Submit search"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
              <div className="flex justify-start">
                <AccessibilitySettings />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
