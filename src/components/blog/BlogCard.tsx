
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  date: string;
  imageUrl: string;
  author: string;
  tags: string[];
}

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

const BlogCard = ({ post, featured = false }: BlogCardProps) => {
  const { id, title, summary, date, imageUrl, author, tags } = post;

  return (
    <Card className={`h-full flex flex-col overflow-hidden transform transition-transform duration-300 hover:shadow-lg ${featured ? 'md:col-span-2' : ''}`}>
      <Link to={`/blog/${id}`} className="no-underline text-foreground">
        <div className={`relative ${featured ? 'aspect-[2/1]' : 'aspect-[3/2]'} overflow-hidden`}>
          <img
            src={imageUrl}
            alt={`Cover image for ${title}`}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        </div>
        <CardHeader>
          <CardTitle className="line-clamp-2">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{summary}</p>
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4 mr-1" aria-hidden="true" />
            <time dateTime={date}>{new Date(date).toLocaleDateString()}</time>
            <span className="mx-2">•</span>
            <span>{author}</span>
          </div>
        </CardContent>
        <CardFooter className="mt-auto">
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && <Badge variant="secondary">+{tags.length - 3}</Badge>}
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default BlogCard;
