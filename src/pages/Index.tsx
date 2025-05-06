
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BlogCard from "@/components/blog/BlogCard";
import { blogPosts } from "@/data/blogPosts";
import { Search } from "lucide-react";

const HomePage = () => {
  const featuredPosts = blogPosts.slice(0, 1);
  const recentPosts = blogPosts.slice(1, 7);

  return (
    <div>
      <section className="py-10 md:py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Inclusive Content for Everyone
          </h1>
          <p className="text-xl mb-8 text-muted-foreground">
            A professional blogging platform focused on accessibility, usability, and inclusive design
            for readers of all abilities.
          </p>
          <div className="max-w-md mx-auto">
            <form 
              className="relative" 
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                // Handle search
              }}
            >
              <Input
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
          {featuredPosts.map((post) => (
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
          {recentPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <section className="py-12 mt-8 bg-muted rounded-lg">
        <div className="text-center max-w-2xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Commitment to Accessibility</h2>
          <p className="mb-6">
            MindfulReach is dedicated to creating content that is accessible to everyone, regardless of ability.
            We follow WCAG 2.1 guidelines and continuously work to improve our platform's accessibility.
          </p>
          <Link to="/about">
            <Button>Learn More About Our Mission</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
