
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BlogCard, { BlogPost } from "@/components/blog/BlogCard";
import { Search, Loader2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { fetchPosts } from "@/services/blogService";
import { useToast } from "@/components/ui/use-toast";

const BlogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const { toast } = useToast();

  // Fetch posts from Supabase
  useEffect(() => {
    const getPosts = async () => {
      try {
        setIsLoading(true);
        const posts = await fetchPosts();
        setBlogPosts(posts);

        // Extract all unique tags
        const tags = [...new Set(posts.flatMap((post) => post.tags))];
        setAllTags(tags);
      } catch (error: any) {
        console.error("Error fetching posts:", error);
        toast({
          title: "Error loading posts",
          description: error.message || "Failed to load blog posts",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    getPosts();
  }, [toast]);

  // Filter posts based on search and selected tag
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = searchQuery === "" || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesTag = selectedTag === null || post.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(searchQuery ? { search: searchQuery } : {});
  };

  const toggleTag = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tag);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Accessibility Blog</h1>
      
      <div className="mb-8">
        <form 
          onSubmit={handleSearch} 
          className="flex flex-col sm:flex-row gap-4"
          role="search"
        >
          <div className="relative flex-1">
            <Input
              type="search"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4 pr-10"
              aria-label="Search articles"
            />
            <Button 
              type="submit" 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>

      <div className="mb-8 overflow-x-auto">
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              size="sm"
              onClick={() => toggleTag(tag)}
              aria-pressed={selectedTag === tag}
            >
              {tag}
            </Button>
          ))}
          {selectedTag && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedTag(null)}
              aria-label="Clear tag filter"
            >
              Clear Filter
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">No articles found</h2>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or filter to find what you're looking for.
          </p>
          <Button onClick={() => { setSearchQuery(""); setSelectedTag(null); setSearchParams({}); }}>
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
