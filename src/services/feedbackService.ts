
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
