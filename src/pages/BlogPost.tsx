
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ArrowLeft, User } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";
import FeedbackForm from "@/components/blog/FeedbackForm";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";

const BlogPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const post = blogPosts.find((post) => post.id === id);

  useEffect(() => {
    // Scroll to top when post changes
    window.scrollTo(0, 0);
  }, [id]);

  if (!post) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
        <p className="text-muted-foreground mb-6">Sorry, the article you're looking for doesn't exist or has been moved.</p>
        <Button onClick={() => navigate("/blog")}>
          Return to Blog
        </Button>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto" aria-labelledby="article-title">
      <Link to="/blog">
        <Button variant="ghost" className="mb-4" aria-label="Back to all articles">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Articles
        </Button>
      </Link>

      <header className="mb-8">
        <h1 id="article-title" className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1" aria-hidden="true" />
            <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
          </div>
          <span aria-hidden="true">•</span>
          <Link to="/author" className="flex items-center hover:text-primary">
            <User className="h-4 w-4 mr-1" aria-hidden="true" />
            {post.author}
          </Link>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="aspect-[2/1] overflow-hidden rounded-lg mb-6">
          <img 
            src={post.imageUrl} 
            alt={`Cover image for ${post.title}`}
            className="w-full h-full object-cover"
          />
        </div>
      </header>

      <div className="prose prose-lg max-w-none mb-12">
        <p className="text-xl font-medium mb-6">{post.summary}</p>
        
        {/* Simulated blog content - in a real app this would be pulled from a CMS or database */}
        <h2>Introduction to Accessibility</h2>
        <p>
          Web accessibility means that websites, tools, and technologies are designed and developed so that people with disabilities can use them. More specifically, people can perceive, understand, navigate, and interact with the Web and contribute to the Web.
        </p>
        <p>
          Accessibility encompasses all disabilities that affect access to the Web, including visual, auditory, physical, speech, cognitive, and neurological disabilities.
        </p>
        
        <h2>Why Accessibility Matters</h2>
        <p>
          The Web is an increasingly important resource in many aspects of life: education, employment, government, commerce, health care, recreation, and more. It is essential that the Web be accessible in order to provide equal access and equal opportunity to people with diverse abilities.
        </p>
        <p>
          Access to information and communications technologies, including the Web, is defined as a basic human right in the United Nations Convention on the Rights of Persons with Disabilities (UN CRPD).
        </p>

        <h2>Key Principles</h2>
        <ul>
          <li><strong>Perceivable</strong>: Information and user interface components must be presentable to users in ways they can perceive.</li>
          <li><strong>Operable</strong>: User interface components and navigation must be operable.</li>
          <li><strong>Understandable</strong>: Information and the operation of user interface must be understandable.</li>
          <li><strong>Robust</strong>: Content must be robust enough that it can be interpreted by a wide variety of user agents, including assistive technologies.</li>
        </ul>

        <h2>Implementation in Practice</h2>
        <p>
          Implementing accessibility principles requires attention to detail throughout the development process. From design to deployment, considering accessibility at each step ensures that the final product is usable by everyone.
        </p>
      </div>
      
      <Separator className="my-8" />

      <section aria-labelledby="related-heading" className="mb-12">
        <h2 id="related-heading" className="text-2xl font-bold mb-6">Related Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogPosts
            .filter(p => p.id !== post.id && p.tags.some(t => post.tags.includes(t)))
            .slice(0, 2)
            .map((relatedPost) => (
              <div key={relatedPost.id} className="border rounded-lg overflow-hidden">
                <Link to={`/blog/${relatedPost.id}`} className="block no-underline">
                  <div className="aspect-[3/2]">
                    <img 
                      src={relatedPost.imageUrl} 
                      alt={`Cover image for ${relatedPost.title}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{relatedPost.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{relatedPost.summary}</p>
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </section>

      <FeedbackForm postId={post.id} />
    </article>
  );
};

export default BlogPostPage;
