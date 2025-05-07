
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BlogCard from "@/components/blog/BlogCard";
import { blogPosts } from "@/data/blogPosts";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchPosts, BlogPost } from "@/services/blogService";
import { useToast } from "@/components/ui/use-toast";

const HomePage = () => {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        const allPosts = await fetchPosts();
        
        if (allPosts.length > 0) {
          setFeaturedPosts(allPosts.slice(0, 1));
          setRecentPosts(allPosts.slice(1, 7));
        } else {
          // Fallback to static data if no posts are returned
          setFeaturedPosts(blogPosts.slice(0, 1));
          setRecentPosts(blogPosts.slice(1, 7));
        }
      } catch (error) {
        console.error("Error loading posts:", error);
        // Fallback to static data on error
        setFeaturedPosts(blogPosts.slice(0, 1));
        setRecentPosts(blogPosts.slice(1, 7));
        
        toast({
          title: "Error loading posts",
          description: "Using sample data instead. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, [toast]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const searchQuery = formData.get('search') as string;
    navigate(`/blog?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div>
      <section className="py-10 md:py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Inclusive Content for Everyone
          </h1>
          
          <div className="relative aspect-[21/9] rounded-xl overflow-hidden mb-8">
            <img 
              src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2000" 
              alt="A diverse group of people collaboratively working with digital content, including a person using a screen reader and another using a specialized keyboard" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent flex items-end">
              <p className="text-xl mb-8 text-white p-6 max-w-2xl mx-auto">
                A professional blogging platform focused on accessibility, usability, and inclusive design
                for readers of all abilities.
              </p>
            </div>
          </div>
          
          <div className="max-w-md mx-auto">
            <form 
              className="relative" 
              role="search"
              onSubmit={handleSearch}
            >
              <Input
                name="search"
                type="search"
                placeholder="Search articles..."
                aria-label="Search articles"
                className="pl-4 pr-10 py-6 text-lg w-full"
              />
              <Button 
                type="submit"
                variant="ghost" 
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </section>

      <section className="py-8">
        <h2 className="text-3xl font-bold mb-8">Featured Article</h2>
        <div className="grid grid-cols-1 gap-6">
          {isLoading ? (
            <div className="h-64 bg-muted animate-pulse rounded-lg"></div>
          ) : featuredPosts.map((post) => (
            <BlogCard key={post.id} post={post} featured={true} />
          ))}
        </div>
      </section>

      <section className="py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Recent Articles</h2>
          <Link to="/blog">
            <Button variant="outline">
              View All Articles
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-lg"></div>
            ))
          ) : recentPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <section className="py-12 mt-8 bg-muted rounded-lg">
        <div className="md:flex items-center gap-8 max-w-4xl mx-auto px-4">
          <div className="md:w-1/3 mb-6 md:mb-0">
            <div className="rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1530811761207-8d9d22f0a141?q=80&w=800" 
                alt="A person using a braille display connected to a laptop" 
                className="w-full h-auto"
              />
            </div>
          </div>
          <div className="md:w-2/3 text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Commitment to Accessibility</h2>
            <p className="mb-6">
              MindfulReach is dedicated to creating content that is accessible to everyone, regardless of ability.
              We follow WCAG 2.1 guidelines and continuously work to improve our platform's accessibility.
            </p>
            <div className="space-x-4">
              <Link to="/about">
                <Button className="mb-2 md:mb-0">Learn About Our Mission</Button>
              </Link>
              <Link to="/author">
                <Button variant="outline">Meet Our Author</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
