
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, UploadCloud, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { createPost, updatePost, fetchPostById } from "@/services/blogService";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const postSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  coverImageUrl: z.string().optional(),
});

type PostFormValues = z.infer<typeof postSchema>;

const CreatePostPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      coverImageUrl: "",
    },
  });

  useEffect(() => {
    // If in edit mode, fetch the existing post
    if (isEditMode && id) {
      const getPost = async () => {
        try {
          const post = await fetchPostById(id);
          if (post) {
            form.setValue("title", post.title);
            form.setValue("content", post.content);
            form.setValue("coverImageUrl", post.imageUrl);
            setTags(post.tags || []);
          } else {
            toast({
              title: "Post not found",
              description: "The post you are trying to edit could not be found.",
              variant: "destructive",
            });
            navigate("/blog");
          }
        } catch (error: any) {
          toast({
            title: "Error fetching post",
            description: error.message || "Failed to fetch post details",
            variant: "destructive",
          });
        }
      };
      
      getPost();
    }
  }, [id, isEditMode, navigate, toast, form]);

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && currentTag.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }
    
    setImageUploading(true);
    try {
      // Upload image to Supabase Storage
      const { data, error } = await supabase.storage
        .from("blog-images")
        .upload(`${user.id}/${Date.now()}-${file.name}`, file, {
          cacheControl: "3600",
          upsert: false,
        });
        
      if (error) throw error;
      
      // Get public URL for the uploaded image
      const { data: publicUrl } = supabase.storage
        .from("blog-images")
        .getPublicUrl(data.path);
        
      form.setValue("coverImageUrl", publicUrl.publicUrl, { shouldValidate: true });
      toast({
        title: "Image uploaded",
        description: "Your cover image was uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setImageUploading(false);
    }
  };

  const onSubmit = async (formData: PostFormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create or edit posts",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const postData = {
        title: formData.title,
        content: formData.content,
        cover_image_url: formData.coverImageUrl || undefined,
        tags: tags.length > 0 ? tags : undefined,
      };
      
      if (isEditMode && id) {
        await updatePost(id, postData);
        toast({
          title: "Post updated",
          description: "Your post was updated successfully",
        });
        navigate(`/blog/${id}`);
      } else {
        const newPostId = await createPost(postData);
        toast({
          title: "Post created",
          description: "Your post was created successfully",
        });
        // Navigate to the new post
        navigate(`/blog/${newPostId}`);
      }
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.message || "Failed to save post",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {isEditMode ? "Edit Post" : "Create New Post"}
      </h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter post title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your post content here..."
                        className="min-h-[300px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      You can use HTML tags for formatting.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="coverImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image</FormLabel>
                    <FormControl>
                      <>
                        {field.value ? (
                          <div className="relative aspect-video w-full rounded-md overflow-hidden border">
                            <img 
                              src={field.value} 
                              alt="Cover preview" 
                              className="w-full h-full object-cover"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2"
                              type="button"
                              onClick={() => form.setValue("coverImageUrl", "", { shouldValidate: true })}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="border border-dashed rounded-md p-8 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <UploadCloud className="h-8 w-8 text-muted-foreground" />
                              <Label
                                htmlFor="cover-image-upload"
                                className="cursor-pointer text-primary hover:underline"
                              >
                                {imageUploading ? (
                                  <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Uploading...
                                  </div>
                                ) : (
                                  "Click to upload image"
                                )}
                                <Input
                                  id="cover-image-upload"
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                  className="hidden"
                                  disabled={imageUploading}
                                />
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                Recommended size: 1200 x 630 pixels
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    placeholder="Add a tag and press Enter"
                    onKeyDown={handleKeyDown}
                  />
                  <Button type="button" onClick={handleAddTag} disabled={!currentTag.trim()}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={() => handleRemoveTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-4 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isEditMode ? "Update Post" : "Publish Post"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreatePostPage;
