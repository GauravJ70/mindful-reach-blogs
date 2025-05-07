
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, X, LogOut, Plus } from "lucide-react";
import AccessibilitySettings from "../accessibility/AccessibilitySettings";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/blog?search=${encodeURIComponent(searchValue)}`);
    setSearchValue("");
    setIsMenuOpen(false);
  };

  const getInitials = (name: string = "User") => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Blog", path: "/blog" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
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
              AccessiBlog
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
            {user && (
              <Link
                to="/blog/create"
                className="flex items-center text-base font-medium transition-colors hover:text-primary no-underline"
              >
                <Plus size={18} className="mr-1" />
                New Post
              </Link>
            )}
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

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.name || "User"} />
                      <AvatarFallback>{getInitials(user.user_metadata?.name)}</AvatarFallback>
                    </Avatar>
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {user.user_metadata?.name || user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/blog/create">Create New Post</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => navigate("/auth")} variant="default">
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            {user && (
              <Button variant="ghost" size="icon" className="mr-2" onClick={() => navigate("/profile")}>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.name || "User"} />
                  <AvatarFallback>{getInitials(user.user_metadata?.name)}</AvatarFallback>
                </Avatar>
              </Button>
            )}
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
              {user && (
                <>
                  <Link
                    to="/blog/create"
                    className="block py-2 px-3 text-base font-medium rounded-md hover:bg-accent no-underline"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Plus size={18} className="inline-block mr-1" />
                    New Post
                  </Link>
                  <Link
                    to="/profile"
                    className="block py-2 px-3 text-base font-medium rounded-md hover:bg-accent no-underline"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="block py-2 px-3 text-base font-medium rounded-md hover:bg-accent no-underline"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full justify-start py-2 px-3 text-base font-medium rounded-md hover:bg-accent text-destructive"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              )}
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
              {!user && (
                <Button onClick={() => { 
                  navigate("/auth");
                  setIsMenuOpen(false);
                }} className="w-full">
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
