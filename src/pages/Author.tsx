
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GithubIcon } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";

const AuthorPage = () => {
  // Filter posts by this author
  const authorPosts = blogPosts.filter(post => post.author === "Gaurav Jadhav");
  
  return (
    <div className="max-w-3xl mx-auto">
      <section className="mb-10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
          <div className="w-48 h-48 rounded-full overflow-hidden shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1514575110897-1253ff7b2ccb?q=80&w=400" 
              alt="Portrait of Gaurav Jadhav, a young man with glasses smiling at the camera"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold mb-4">Gaurav Jadhav</h1>
            <p className="text-lg text-muted-foreground mb-4">
              Information Technology Student & Accessibility Advocate
            </p>
            <div className="flex justify-center md:justify-start gap-4">
              <Button variant="outline" size="sm" asChild>
                <a href="https://github.com/" target="_blank" rel="noopener noreferrer" aria-label="Visit Gaurav's GitHub profile">
                  <GithubIcon className="h-4 w-4 mr-2" />
                  GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="md:flex gap-8 items-center mb-12">
          <div className="md:w-2/5 mb-6 md:mb-0">
            <div className="rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1559223607-a43c990c692c?q=80&w=800" 
                alt="A student working on accessible web design using a laptop with an assistive technology device"
                className="w-full h-auto"
              />
            </div>
          </div>
          <div className="md:w-3/5 prose max-w-none">
            <h2 className="text-2xl font-bold mb-4">About Gaurav</h2>
            <p>
              Gaurav Jadhav is a Second Year Information Technology student at Vishwakarma Institute of Technology. Passionate about accessible web design and digital inclusion, Gaurav aims to build technology that empowers every user — regardless of ability.
            </p>
            <p>
              With a strong foundation in web development and a growing expertise in accessibility standards, Gaurav is committed to creating digital experiences that are not just functional, but truly inclusive. He believes that technology should be a bridge, not a barrier, and works tirelessly to promote this vision through his writing, coding projects, and community involvement.
            </p>
          </div>
        </div>
        
        <div className="prose max-w-none mb-10">
          <p>
            Gaurav founded MindfulReach with the mission to demonstrate that accessibility and beautiful design can coexist, and to educate fellow developers about the importance of building with all users in mind.
          </p>
          <h2 className="text-2xl font-bold mb-4 mt-8">My Vision</h2>
          <p>
            "I envision a digital world where no one is left behind due to inaccessible design. Through MindfulReach, I hope to showcase how thoughtful, inclusive design not only meets legal standards but creates better experiences for everyone. My goal is to inspire the next generation of developers to consider accessibility not as an afterthought, but as a fundamental aspect of good design."
          </p>
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold mb-6">Articles by Gaurav</h2>
        <div className="grid gap-6 mb-8">
          {authorPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3 aspect-video md:aspect-auto">
                  <img 
                    src={post.imageUrl} 
                    alt="" 
                    className="w-full h-full object-cover"
                    aria-hidden="true"
                  />
                </div>
                <CardContent className="md:w-2/3 p-4 md:p-6">
                  <Link to={`/blog/${post.id}`} className="no-underline">
                    <h3 className="font-bold text-xl mb-2 hover:text-primary">{post.title}</h3>
                  </Link>
                  <p className="text-muted-foreground mb-3">{post.summary}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(post.date).toLocaleDateString()}
                  </p>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Link to="/blog">
            <Button variant="outline">View All Articles</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AuthorPage;
