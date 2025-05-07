
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { submitContactForm, ContactSubmission } from "@/services/contactService";

// This schema should match the ContactSubmission interface in contactService.ts
const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const ContactPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      setIsSubmitting(true);
      // The data from the form now exactly matches the ContactSubmission interface
      const contactData: ContactSubmission = {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message
      };
      await submitContactForm(contactData);
      form.reset();
      toast({
        title: "Message Sent",
        description: "Thank you for contacting us. We'll respond to your inquiry soon.",
      });
    } catch (error: any) {
      console.error("Contact form error:", error);
      toast({
        title: "Failed to send message",
        description: error.message || "There was a problem sending your message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Have questions, feedback, or need assistance with accessibility? We're here to help.
      </p>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Get In Touch</h2>
          <p className="mb-6">
            We welcome your questions, suggestions, and feedback about our content, accessibility features, and services.
          </p>
          
          <div className="space-y-4 mb-8">
            <h3 className="font-medium">Ways to Reach Us</h3>
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h4 className="font-medium">Website</h4>
                <p className="text-sm text-muted-foreground">accessiblog.com</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h4 className="font-medium">Email</h4>
                <p className="text-sm text-muted-foreground">support@accessiblog.com</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <h4 className="font-medium">Social Media</h4>
                <p className="text-sm text-muted-foreground">@AccessiBlog on all platforms</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Accessibility Feedback</h3>
            <p className="text-sm text-muted-foreground">
              We are committed to making our content accessible to all users. 
              If you encounter any accessibility barriers on our site, please let us know.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Send Us a Message</CardTitle>
            <CardDescription>
              Fill out the form below and we'll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="How can we help you?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Please describe your inquiry in detail..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>
                        Include any specific details that might help us assist you better.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactPage;
