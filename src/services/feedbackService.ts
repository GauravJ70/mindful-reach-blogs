
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
    // Check if posts table has any content
    const { data: allPosts, error: checkError } = await supabase
      .from("posts")
      .select("id, title")
      .limit(5);
      
    if (checkError) {
      console.error("Error checking posts table:", checkError);
    } else {
      console.log("Current posts in database:", allPosts);
    }
    
    // If no posts in database or can't find a match, use the original post_id
    // This allows feedback to be collected even if posts aren't in the database yet
    const postId = feedback.post_id;
    
    // Insert feedback with the post_id as provided
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
