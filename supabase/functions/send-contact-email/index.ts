
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message }: ContactEmailRequest = await req.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      throw new Error("Missing required fields");
    }

    // For now, let's log the data since we don't have email setup yet
    console.log("Contact form submission:", { name, email, subject, message });

    // In a real application, you would send an email using your preferred provider
    // Example with Resend:
    // const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    // await resend.emails.send({
    //   from: "AccessiBlog <no-reply@accessiblog.com>",
    //   to: "gauravjadhav0900@gmail.com",
    //   subject: `New contact form: ${subject}`,
    //   html: `<h1>New message from ${name}</h1>
    //          <p><strong>Email:</strong> ${email}</p>
    //          <p><strong>Subject:</strong> ${subject}</p>
    //          <p><strong>Message:</strong></p>
    //          <p>${message}</p>`,
    // });

    return new Response(
      JSON.stringify({ success: true, message: "Contact form received" }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in send-contact-email function:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
