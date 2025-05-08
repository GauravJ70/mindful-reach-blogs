import { supabase } from "@/integrations/supabase/client";
import { blogPosts } from "@/data/blogPosts";

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  date: string;
  imageUrl: string;
  author: string;
  authorId: string;
  tags: string[];
}

export interface BlogPostDetails extends BlogPost {
  content: string;
}

export async function fetchPosts(): Promise<BlogPost[]> {
  // Return static blog posts instead of fetching from Supabase
  return blogPosts;
}

export async function fetchPostById(id: string): Promise<BlogPostDetails | null> {
  // Find the post in our static data
  const post = blogPosts.find(post => post.id === id);
  
  if (!post) {
    return null;
  }
  
  // Convert BlogPost to BlogPostDetails with mock content
  return {
    ...post,
    content: `<h2>This is a static blog post</h2>
      <p>This is a placeholder for the full content of "${post.title}".</p>
      <p>In a production environment, this would be fetched from a database or CMS.</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at justo vel libero tincidunt varius. 
      Donec eget ligula eu eros tempus tincidunt. Vestibulum ante ipsum primis in faucibus orci luctus 
      et ultrices posuere cubilia Curae; Nam vel nunc non libero tincidunt tincidunt.</p>
      <h3>Key Features</h3>
      <ul>
        <li>Feature one explanation</li>
        <li>Feature two details</li>
        <li>Feature three overview</li>
      </ul>
      <p>Praesent euismod, nisl eget ultricies ultrices, nunc nunc ultricies nunc, quis ultricies nisl 
      nisl eget nisl. Nullam at justo vel libero tincidunt varius. Donec eget ligula eu eros tempus tincidunt.</p>`
  };
}

// Keep these functions but make them no-ops or mock implementations
export async function createPost(post: {
  title: string;
  content: string;
  cover_image_url?: string;
  tags?: string[];
}): Promise<string> {
  console.log("Creating post (mock):", post);
  return "mock-post-id";
}

export async function updatePost(id: string, post: {
  title?: string;
  content?: string;
  cover_image_url?: string;
  tags?: string[];
}): Promise<void> {
  console.log(`Updating post ${id} (mock):`, post);
}

export async function deletePost(id: string): Promise<void> {
  console.log(`Deleting post ${id} (mock)`);
}
