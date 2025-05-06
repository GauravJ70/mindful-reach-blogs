
import { supabase } from "@/integrations/supabase/client";

export interface ContactSubmission {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function submitContactForm(contactData: ContactSubmission): Promise<void> {
  // First, store in Supabase
  const { error } = await supabase
    .from("contact_messages")
    .insert([contactData]);
  
  if (error) {
    console.error("Error storing contact form:", error);
    throw new Error("Failed to submit contact form");
  }
  
  // Then, send email via Edge Function
  try {
    const response = await supabase.functions.invoke("send-contact-email", {
      body: contactData
    });
    
    if (!response.data?.success) {
      console.error("Email sending error:", response.data);
      throw new Error("Failed to send email notification");
    }
  } catch (err) {
    console.error("Email function error:", err);
    // Don't throw here - the data is already saved to the database
    // Just log the error and continue
  }
}
