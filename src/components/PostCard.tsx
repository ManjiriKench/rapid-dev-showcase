import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, User, Mail, Phone } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Post {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  contact_info: string;
  location: string | null;
  image_url: string | null;
  date_posted: string;
  date_lost_found: string | null;
  user_id: string;
  profiles?: {
    full_name: string | null;
  } | null;
}

interface PostCardProps {
  post: Post;
  onContact: (contactInfo: string) => void;
}

const PostCard = ({ post, onContact }: PostCardProps) => {
  const isLost = post.category === 'lost';
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        {post.image_url && (
          <div className="aspect-video overflow-hidden">
            <img 
              src={post.image_url} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg leading-tight">{post.title}</h3>
            <div className="flex gap-2">
              <Badge variant={isLost ? "destructive" : "default"}>
                {post.category.toUpperCase()}
              </Badge>
              {post.status !== 'active' && (
                <Badge variant="secondary">
                  {post.status.toUpperCase()}
                </Badge>
              )}
            </div>
          </div>
          
          <p className="text-muted-foreground text-sm line-clamp-3">
            {post.description}
          </p>
          
          <div className="space-y-2 text-sm text-muted-foreground">
            {post.profiles?.full_name && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.profiles.full_name}</span>
              </div>
            )}
            
            {post.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{post.location}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                Posted {formatDistanceToNow(new Date(post.date_posted))} ago
              </span>
            </div>
            
            {post.date_lost_found && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {isLost ? 'Lost' : 'Found'} on {new Date(post.date_lost_found).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
          
          {post.status === 'active' && (
            <Button 
              onClick={() => onContact(post.contact_info)}
              className="w-full mt-4"
              variant="outline"
            >
              <Mail className="h-4 w-4 mr-2" />
              Contact
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;