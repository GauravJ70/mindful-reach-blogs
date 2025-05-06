
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { StarIcon } from "lucide-react";
import { submitFeedback } from "@/services/feedbackService";
import { Input } from "@/components/ui/input";

interface FeedbackFormProps {
  postId: string;
}

const FeedbackForm = ({ postId }: FeedbackFormProps) => {
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleStarClick = (value: number) => {
    setRating(value);
  };

  const handleStarKeyDown = (event: React.KeyboardEvent, value: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setRating(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validation
    if (!rating) {
      toast({
        title: "Rating required",
        description: "Please select a star rating before submitting feedback.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Submit feedback to Supabase
      await submitFeedback({
        post_id: postId,
        name: name || undefined,
        email: email || undefined,
        rating,
        comment: feedback || undefined
      });
      
      toast({
        title: "Thank you for your feedback!",
        description: "Your input helps us improve our content.",
      });

      // Reset the form
      setRating(null);
      setFeedback("");
      setName("");
      setEmail("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Submission failed",
        description: "There was a problem submitting your feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 md:p-6 bg-card">
      <h3 className="text-xl font-bold mb-4">Share Your Feedback</h3>
      <form onSubmit={handleSubmit}>
        <fieldset className="mb-4">
          <legend className="text-sm font-medium mb-2">How would you rate this article?</legend>
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
        </fieldset>

        <div className="mb-4">
          <label htmlFor="feedback-name" className="block text-sm font-medium mb-2">
            Your Name (optional)
          </label>
          <Input
            id="feedback-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="feedback-email" className="block text-sm font-medium mb-2">
            Your Email (optional)
          </label>
          <Input
            id="feedback-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            className="w-full"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="feedback" className="block text-sm font-medium mb-2">
            Additional comments (optional)
          </label>
          <Textarea
            id="feedback"
            placeholder="Share your thoughts about this article..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
            className="w-full"
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </Button>
      </form>
    </div>
  );
};

export default FeedbackForm;
