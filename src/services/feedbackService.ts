
import { supabase } from "@/integrations/supabase/client";

export interface FeedbackSubmission {
  post_id: string;
  name?: string;
  email?: string;
  rating: number;
  comment?: string;
}

export async function submitFeedback(feedback: FeedbackSubmission): Promise<void> {
  console.log("Submitting feedback:", feedback);
  
  try {
    // Try to determine if the post_id is a UUID or a slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(feedback.post_id);
    
    let postId = feedback.post_id;
    
    if (!isUUID) {
      console.log("Post ID appears to be a slug, attempting to find the associated post");
      
      // Try multiple ways to find the post:
      // 1. First try to match by slug (assuming slug is stored in the title with hyphens)
      let { data: postBySlug, error: slugError } = await supabase
        .from("posts")
        .select("id")
        .eq("title", feedback.post_id.replace(/-/g, " "))
        .single();
      
      // 2. If that fails, try a more flexible search using ILIKE
      if (slugError || !postBySlug) {
        console.log("No exact match by title, trying fuzzy search");
        const { data: postByFuzzy, error: fuzzyError } = await supabase
          .from("posts")
          .select("id")
          .ilike("title", `%${feedback.post_id.replace(/-/g, " ")}%`)
          .single();
          
        if (fuzzyError || !postByFuzzy) {
          console.error("Error finding post for feedback:", fuzzyError || "No post found via fuzzy search");
          
          // 3. Get all posts to debug what's available
          const { data: allPosts, error: listError } = await supabase
            .from("posts")
            .select("id, title");
            
          if (!listError && allPosts) {
            console.log("Available posts:", allPosts);
          }
          
          throw new Error("Could not find the associated post. Please try again later.");
        }
        
        postId = postByFuzzy.id;
        console.log("Found post via fuzzy search:", postId);
      } else {
        postId = postBySlug.id;
        console.log("Found post via exact title match:", postId);
      }
    }

    // Now submit with the proper UUID
    const { error } = await supabase
      .from("feedback")
      .insert([{
        ...feedback,
        post_id: postId
      }]);
    
    if (error) {
      console.error("Error submitting feedback to database:", error);
      throw new Error("Failed to submit feedback: " + error.message);
    }

    console.log("Feedback successfully saved to database");

    // Send notification via webhook
    try {
      await sendFeedbackNotification({
        ...feedback,
        post_id: postId
      });
    } catch (notificationError) {
      console.error("Error sending feedback notification:", notificationError);
      // We don't throw here to avoid affecting the user experience
      // The feedback is saved in the database even if notification fails
    }
  } catch (error: any) {
    console.error("Error in submitFeedback function:", error);
    throw error;
  }
}

async function sendFeedbackNotification(feedback: FeedbackSubmission): Promise<void> {
  const webhookUrl = "https://hooks.zapier.com/hooks/catch/22884362/2ncd0om/";
  
  try {
    console.log("Sending feedback notification to webhook:", webhookUrl);
    
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "no-cors", // Handle CORS restrictions
      body: JSON.stringify({
        ...feedback,
        email_to: "gauravjadhav0900@gmail.com",
        submitted_at: new Date().toISOString(),
        notification_type: "new_feedback"
      }),
    });
    
    console.log("Feedback notification sent successfully");
  } catch (error) {
    console.error("Failed to send feedback notification:", error);
    throw error;
  }
}

export async function getFeedbackForPost(postId: string): Promise<any[]> {
  // This function is only callable by admins or post authors due to RLS
  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .eq("post_id", postId);
  
  if (error) {
    console.error("Error fetching feedback:", error);
    throw new Error("Failed to fetch feedback");
  }
  
  return data;
}
