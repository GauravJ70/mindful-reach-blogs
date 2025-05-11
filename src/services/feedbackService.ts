
import { supabase } from "@/integrations/supabase/client";

export interface FeedbackSubmission {
  post_id: string;
  name?: string;
  email?: string;
  rating: number;
  comment?: string;
}

export async function submitFeedback(feedback: FeedbackSubmission): Promise<void> {
  const { error } = await supabase
    .from("feedback")
    .insert([feedback]);
  
  if (error) {
    console.error("Error submitting feedback:", error);
    throw new Error("Failed to submit feedback");
  }

  // Send notification via webhook
  try {
    await sendFeedbackNotification(feedback);
  } catch (notificationError) {
    console.error("Error sending feedback notification:", notificationError);
    // We don't throw here to avoid affecting the user experience
    // The feedback is saved in the database even if notification fails
  }
}

async function sendFeedbackNotification(feedback: FeedbackSubmission): Promise<void> {
  const webhookUrl = "https://hooks.zapier.com/hooks/catch/123456/abcdef/"; // Replace with your actual Zapier webhook URL
  
  try {
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
