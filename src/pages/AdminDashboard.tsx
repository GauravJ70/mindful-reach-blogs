
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface FeedbackItem {
  id: string;
  name: string | null;
  email: string | null;
  rating: number;
  comment: string | null;
  submitted_at: string;
  post_id: string;
  post_title?: string;
  status: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  sent_at: string;
}

const AdminDashboardPage = () => {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        // Fetch feedback items with post titles
        const { data: feedbackData, error: feedbackError } = await supabase
          .from("feedback")
          .select(`
            id,
            name,
            email,
            rating,
            comment,
            submitted_at,
            post_id,
            status
          `)
          .order("submitted_at", { ascending: false });
        
        if (feedbackError) throw feedbackError;
        
        // Fetch post titles for each feedback
        const feedbackWithPostTitles = await Promise.all(
          (feedbackData || []).map(async (feedback) => {
            const { data: postData } = await supabase
              .from("posts")
              .select("title")
              .eq("id", feedback.post_id)
              .single();
              
            return {
              ...feedback,
              post_title: postData?.title || "Unknown post"
            };
          })
        );
        
        setFeedbackItems(feedbackWithPostTitles);

        // Fetch contact messages
        const { data: contactData, error: contactError } = await supabase
          .from("contact_messages")
          .select("*")
          .order("sent_at", { ascending: false });
        
        if (contactError) throw contactError;
        setContactMessages(contactData || []);
      } catch (error: any) {
        toast({
          title: "Error fetching data",
          description: error.message || "Could not load admin data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Tabs defaultValue="feedback">
          <TabsList className="w-full max-w-md mb-6">
            <TabsTrigger value="feedback" className="flex-1">
              Feedback
              <Badge variant="secondary" className="ml-2">{feedbackItems.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex-1">
              Contact Messages
              <Badge variant="secondary" className="ml-2">{contactMessages.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feedback">
            <div className="grid gap-6">
              {feedbackItems.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    No feedback submissions yet.
                  </CardContent>
                </Card>
              ) : (
                feedbackItems.map((item) => (
                  <Card key={item.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div>
                          <CardTitle className="text-lg">{item.post_title}</CardTitle>
                          <CardDescription>
                            {item.name || "Anonymous"} • {formatDate(item.submitted_at)}
                          </CardDescription>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < item.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                              }`}
                            />
                          ))}
                          <Badge variant="outline" className="ml-2">
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {item.comment ? (
                        <p className="text-sm">{item.comment}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">
                          No additional comments provided.
                        </p>
                      )}
                      {item.email && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Contact: {item.email}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="contact">
            <div className="grid gap-6">
              {contactMessages.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    No contact messages yet.
                  </CardContent>
                </Card>
              ) : (
                contactMessages.map((message) => (
                  <Card key={message.id} className="cursor-pointer hover:bg-secondary/10 transition-colors">
                    <CardHeader 
                      className="pb-2" 
                      onClick={() => setSelectedMessage(message)}
                    >
                      <CardTitle className="flex justify-between items-center">
                        <span>{message.subject}</span>
                        <Badge variant="outline">{formatDate(message.sent_at)}</Badge>
                      </CardTitle>
                      <CardDescription>
                        From: {message.name} ({message.email})
                      </CardDescription>
                    </CardHeader>
                    <CardContent onClick={() => setSelectedMessage(message)}>
                      <p className="text-sm truncate">
                        {message.message}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}

      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        {selectedMessage && (
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>{selectedMessage.subject}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">From:</div>
                <div>{selectedMessage.name} ({selectedMessage.email})</div>
                
                <div className="text-muted-foreground">Date:</div>
                <div>{formatDate(selectedMessage.sent_at)}</div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default AdminDashboardPage;
