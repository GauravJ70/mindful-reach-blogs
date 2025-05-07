
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { StarIcon } from "lucide-react";
import { submitFeedback } from "@/services/feedbackService";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface FeedbackFormProps {
  postId: string;
}

const feedbackSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Please enter a valid email").optional().or(z.literal('')),
  rating: z.number().min(1, "Please select a rating").max(5),
  comment: z.string().optional(),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

const FeedbackForm = ({ postId }: FeedbackFormProps) => {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      name: "",
      email: "",
      rating: 0,
      comment: "",
    },
  });

  const rating = form.watch("rating");

  const handleStarClick = (value: number) => {
    form.setValue("rating", value, { shouldValidate: true });
  };

  const handleStarKeyDown = (event: React.KeyboardEvent, value: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleStarClick(value);
    }
  };

  const onSubmit = async (data: FeedbackFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Submit feedback to Supabase
      await submitFeedback({
        post_id: postId,
        name: data.name || undefined,
        email: data.email || undefined,
        rating: data.rating,
        comment: data.comment || undefined
      });
      
      toast({
        title: "Thank you for your feedback!",
        description: "Your input helps us improve our content.",
      });

      // Reset the form
      form.reset();
    } catch (error: any) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Submission failed",
        description: error.message || "There was a problem submitting your feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Share Your Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rating"
              render={() => (
                <FormItem>
                  <FormLabel>How would you rate this article?</FormLabel>
                  <FormControl>
                    <div 
                      className="flex space-x-1" 
                      role="radiogroup" 
                      aria-label="Article rating"
                    >
                      {[1, 2, 3, 4, 5].map((value) => (
                        <div
                          key={value}
                          onClick={() => handleStarClick(value)}
                          onKeyDown={(e) => handleStarKeyDown(e, value)}
                          onMouseEnter={() => setHoveredStar(value)}
                          onMouseLeave={() => setHoveredStar(null)}
                          role="radio"
                          aria-checked={rating === value}
                          aria-label={`${value} star${value > 1 ? "s" : ""}`}
                          tabIndex={0}
                          className="p-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary rounded"
                        >
                          <StarIcon
                            className={`h-6 w-6 ${
                              (rating && value <= rating) || (hoveredStar && value <= hoveredStar)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            } transition-colors`}
                            aria-hidden="true"
                          />
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name (optional)</FormLabel>
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
                  <FormLabel>Your Email (optional)</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your.email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Comments (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your thoughts about this article..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FeedbackForm;
