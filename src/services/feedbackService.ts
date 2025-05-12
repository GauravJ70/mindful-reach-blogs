
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
    // First, get the proper UUID for the post based on its slug
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("id")
      .eq("id", feedback.post_id)
      .single();
    
    if (postError) {
      // Try to find the post by treating the post_id as a slug
      const { data: sluggedPost, error: slugError } = await supabase
        .from("posts")
        .select("id")
        .ilike("title", feedback.post_id.replace(/-/g, " "))
        .single();
        
      if (slugError || !sluggedPost) {
        console.error("Error finding post for feedback:", slugError || "No post found");
        throw new Error("Could not find the associated post. Please try again later.");
      }
      
      // Use the UUID from the found post
      feedback = { ...feedback, post_id: sluggedPost.id };
    } else if (post) {
      // Use the UUID as is
      feedback = { ...feedback, post_id: post.id };
    }

    // Now submit with the proper UUID
    const { error } = await supabase
      .from("feedback")
      .insert([feedback]);
    
    if (error) {
      console.error("Error submitting feedback to database:", error);
      throw new Error("Failed to submit feedback: " + error.message);
    }

    console.log("Feedback successfully saved to database");

    // Send notification via webhook
    try {
      await sendFeedbackNotification(feedback);
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
  const webhookUrl = "https://hooks.zapier.com/hooks/catch/22884362/2ncd0om/"; // Updated with the provided Zapier webhook URL
  
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
