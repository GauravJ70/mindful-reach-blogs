
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ArrowLeft, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import FeedbackForm from "@/components/blog/FeedbackForm";
import { fetchPostById, BlogPostDetails } from "@/services/blogService";
import { useToast } from "@/components/ui/use-toast";

const BlogPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [post, setPost] = useState<BlogPostDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Scroll to top when post changes
    window.scrollTo(0, 0);
    
    const getPost = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const postData = await fetchPostById(id);
        setPost(postData);
      } catch (error: any) {
        console.error("Error fetching post:", error);
        toast({
          title: "Error loading post",
          description: error.message || "Failed to load blog post",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    getPost();
  }, [id, toast]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading article...</p>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" aria-hidden="true" />
            <span>{post.author}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        
        {post.imageUrl && (
          <div className="aspect-[2/1] overflow-hidden rounded-lg mb-6">
            <img 
              src={post.imageUrl} 
              alt={`Cover image for ${post.title}`}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </header>

      <div className="prose prose-lg max-w-none mb-12">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
        
        {/* Add video section for all accessibility-related posts */}
        {post.tags.includes("Accessibility") && (
          <div className="my-8 rounded-lg overflow-hidden">
            <h2 className="text-2xl font-bold mb-4">How People with Disabilities Use the Web</h2>
            <div className="aspect-video mb-4">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/8Rn5pXCdZWU" 
                title="How People with Disabilities Use the Web" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen 
                className="rounded-lg"
              ></iframe>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              This video demonstrates how people with various disabilities navigate and use the web with assistive technologies.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1516239482140-b50fb7d819c7?q=80&w=2000" 
                  alt="Person using a screen reader with headphones to navigate a website" 
                  className="rounded-lg w-full h-auto mb-2"
                />
                <p className="text-sm text-muted-foreground">Screen reader users rely on well-structured content with proper headings and alt text.</p>
              </div>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1555617171-a072c97e09a7?q=80&w=2000" 
                  alt="Close-up of hands using an adaptive keyboard with enlarged keys" 
                  className="rounded-lg w-full h-auto mb-2"
                />
                <p className="text-sm text-muted-foreground">Specialized input devices help people with motor disabilities interact with websites.</p>
              </div>
            </div>
            
            <div className="bg-muted p-6 rounded-lg my-8">
              <h3 className="text-xl font-bold mb-3">Impact Statistics</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Over 1 billion people worldwide live with some form of disability</li>
                <li>15% of the world's population experiences disability in some form</li>
                <li>71% of users with disabilities will leave a website that is not accessible</li>
                <li>MindfulReach has helped over 25,000 users access content through accessible design</li>
              </ul>
            </div>
          </div>
        )}
      </div>
      
      <Separator className="my-8" />

      {post && <FeedbackForm postId={post.id} />}
    </article>
  );
};

export default BlogPostPage;
