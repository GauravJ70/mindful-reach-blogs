
import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from "@/components/blog/BlogCard";

export interface BlogPostDetails extends BlogPost {
  content: string;
}

export async function fetchPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("posts")
    .select(`
      id, 
      title, 
      content,
      cover_image_url,
      published_at,
      tags,
      profiles(name)
    `)
    .order("published_at", { ascending: false });
  
  if (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch blog posts");
  }
  
  return data.map((post): BlogPost => ({
    id: post.id,
    title: post.title,
    summary: post.content.substring(0, 150) + "...",
    date: post.published_at,
    imageUrl: post.cover_image_url || "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
    author: post.profiles?.name || "Unknown Author",
    tags: post.tags || []
  }));
}

export async function fetchPostById(id: string): Promise<BlogPostDetails | null> {
  const { data, error } = await supabase
    .from("posts")
    .select(`
      id, 
      title, 
      content,
      cover_image_url,
      published_at,
      tags,
      profiles(name)
    `)
    .eq("id", id)
    .single();
  
  if (error) {
    console.error("Error fetching post:", error);
    if (error.code === "PGRST116") {
      return null; // Post not found
    }
    throw new Error("Failed to fetch blog post");
  }
  
  return {
    id: data.id,
    title: data.title,
    content: data.content,
    summary: data.content.substring(0, 150) + "...",
    date: data.published_at,
    imageUrl: data.cover_image_url || "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
    author: data.profiles?.name || "Unknown Author",
    tags: data.tags || []
  };
}

export async function createPost(post: {
  title: string;
  content: string;
  cover_image_url?: string;
  tags?: string[];
}): Promise<string> {
  const { data, error } = await supabase
    .from("posts")
    .insert([post])
    .select();
  
  if (error) {
    console.error("Error creating post:", error);
    throw new Error("Failed to create blog post");
  }
  
  return data[0].id;
}

export async function updatePost(id: string, post: {
  title?: string;
  content?: string;
  cover_image_url?: string;
  tags?: string[];
}): Promise<void> {
  const { error } = await supabase
    .from("posts")
    .update(post)
    .eq("id", id);
  
  if (error) {
    console.error("Error updating post:", error);
    throw new Error("Failed to update blog post");
  }
}

export async function deletePost(id: string): Promise<void> {
  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id);
  
  if (error) {
    console.error("Error deleting post:", error);
    throw new Error("Failed to delete blog post");
  }
}
