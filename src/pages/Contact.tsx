
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const ContactPage = () => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    needsResponse: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  
  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, subject: value }));
    
    // Clear error when field is edited
    if (errors.subject) {
      setErrors((prev) => ({ ...prev, subject: "" }));
    }
  };
  
  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, needsResponse: checked }));
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.subject) {
      newErrors.subject = "Subject is required";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log("Form submitted:", formData);
      
      // Show success message
      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. We'll get back to you soon.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        needsResponse: false
      });
    } else {
      // Show error message
      toast({
        title: "Form submission failed",
        description: "Please check the form for errors and try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
      
      <p className="mb-8 text-lg">
        Have questions, suggestions, or feedback? We'd love to hear from you! Use the form below to get in touch with our team.
      </p>
      
      <div className="border rounded-lg p-6 bg-card">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="block mb-2">
                Name <span aria-hidden="true" className="text-destructive">*</span>
                <span className="sr-only">(required)</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                aria-required="true"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <p id="name-error" className="text-sm text-destructive mt-1" role="alert">
                  {errors.name}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="email" className="block mb-2">
                Email <span aria-hidden="true" className="text-destructive">*</span>
                <span className="sr-only">(required)</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-destructive mt-1" role="alert">
                  {errors.email}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="subject" className="block mb-2">
                Subject <span aria-hidden="true" className="text-destructive">*</span>
                <span className="sr-only">(required)</span>
              </Label>
              <Select 
                value={formData.subject} 
                onValueChange={handleSelectChange}
                aria-required="true"
                aria-invalid={!!errors.subject}
              >
                <SelectTrigger 
                  id="subject"
                  aria-describedby={errors.subject ? "subject-error" : undefined}
                >
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Inquiry</SelectItem>
                  <SelectItem value="feedback">Website Feedback</SelectItem>
                  <SelectItem value="accessibility">Accessibility Issue</SelectItem>
                  <SelectItem value="suggestion">Content Suggestion</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.subject && (
                <p id="subject-error" className="text-sm text-destructive mt-1" role="alert">
                  {errors.subject}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="message" className="block mb-2">
                Message <span aria-hidden="true" className="text-destructive">*</span>
                <span className="sr-only">(required)</span>
              </Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                aria-required="true"
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
              />
              {errors.message && (
                <p id="message-error" className="text-sm text-destructive mt-1" role="alert">
                  {errors.message}
                </p>
              )}
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="needsResponse" 
                checked={formData.needsResponse}
                onCheckedChange={handleCheckboxChange}
              />
              <div className="grid gap-1.5 leading-none">
                <Label 
                  htmlFor="needsResponse" 
                  className="text-sm cursor-pointer"
                >
                  I would like to receive a response
                </Label>
              </div>
            </div>
          </div>
          
          <Button type="submit" className="w-full md:w-auto">
            Send Message
          </Button>
        </form>
      </div>
      
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Other Ways to Reach Us</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6 bg-card">
            <h3 className="text-xl font-bold mb-2">Accessibility Support</h3>
            <p className="mb-3">
              For urgent accessibility issues or if you need alternative ways to contact us:
            </p>
            <p className="mb-1">
              <strong>Email:</strong> accessibility@mindfulreach.example.com
            </p>
          </div>
          
          <div className="border rounded-lg p-6 bg-card">
            <h3 className="text-xl font-bold mb-2">Content Suggestions</h3>
            <p className="mb-3">
              Have an idea for an article or topic you'd like us to cover?
            </p>
            <p className="mb-1">
              <strong>Email:</strong> content@mindfulreach.example.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
