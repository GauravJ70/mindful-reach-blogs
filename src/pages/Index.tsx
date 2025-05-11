
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BlogCard from "@/components/blog/BlogCard";
import { Search, User, Eye, Accessibility } from "lucide-react";
import { useState } from "react";
import { blogPosts } from "@/data/blogPosts";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Static blog posts for featured and recent sections
  const featuredPosts = blogPosts.slice(0, 1);
  const recentPosts = blogPosts.slice(1, 7);

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
          
          <div className="relative rounded-xl overflow-hidden mb-8">
            <AspectRatio ratio={21/9}>
              <img 
                src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=2000" 
                alt="A diverse group of people collaboratively working with digital content, including a person using a screen reader and another using a specialized keyboard" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent flex items-end">
                <p className="text-xl mb-8 text-white p-6 max-w-2xl mx-auto">
                  A professional blogging platform focused on accessibility, usability, and inclusive design
                  for readers of all abilities.
                </p>
              </div>
            </AspectRatio>
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

      {/* Impact statistics section */}
      <section className="py-8 bg-muted rounded-lg mb-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">Making the Web Better for Everyone</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <Accessibility className="h-10 w-10 mx-auto mb-4 text-primary" />
              <p className="text-3xl font-bold text-primary mb-2">25,000+</p>
              <p>People with disabilities helped through our accessible content</p>
            </div>
            
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <User className="h-10 w-10 mx-auto mb-4 text-primary" />
              <p className="text-3xl font-bold text-primary mb-2">15%</p>
              <p>Of the world's population lives with a disability</p>
            </div>
            
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <Eye className="h-10 w-10 mx-auto mb-4 text-primary" />
              <p className="text-3xl font-bold text-primary mb-2">98%</p>
              <p>User satisfaction with our accessible content</p>
            </div>
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
              <AspectRatio ratio={4/3}>
                <img 
                  src="https://images.unsplash.com/photo-1555617171-a072c97e09a7?q=80&w=800" 
                  alt="A person using a specialized keyboard to navigate a website" 
                  className="w-full h-full object-cover"
                />
              </AspectRatio>
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
