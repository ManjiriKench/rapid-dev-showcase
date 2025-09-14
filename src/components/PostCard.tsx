
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, User, Mail, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Post {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  contact_info: string; // Now always present but may be masked
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
  onDelete: (postId: string) => void;
  currentUserId?: string;
  isAuthenticated?: boolean;
}

const PostCard = ({ post, onContact, onDelete, currentUserId, isAuthenticated }: PostCardProps) => {
  const isLost = post.category === 'lost';
  const isOwner = currentUserId === post.user_id;
  const isMaskedContact = post.contact_info === 'Sign in to view contact information';
  
  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-white/20 relative">
      <CardContent className="p-0">
        {post.image_url && (
          <div className="aspect-video overflow-hidden relative">
            <img 
              src={post.image_url} 
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}
        
        <div className="p-6 space-y-4">
          {isOwner && (
            <Button
              onClick={() => onDelete(post.id)}
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-xl leading-tight text-gray-800 flex-1">{post.title}</h3>
            <div className="flex gap-2 flex-shrink-0">
              <Badge 
                variant={isLost ? "destructive" : "default"}
                className={isLost 
                  ? "bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-sm" 
                  : "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-sm"
                }
              >
                {post.category.toUpperCase()}
              </Badge>
              {post.status !== 'active' && (
                <Badge 
                  variant="secondary"
                  className="bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0"
                >
                  {post.status.toUpperCase()}
                </Badge>
              )}
            </div>
          </div>
          
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
            {post.description}
          </p>
          
          <div className="space-y-3 text-sm">
            {post.profiles?.full_name && (
              <div className="flex items-center gap-3 text-gray-600">
                <div className="p-1.5 bg-blue-100 rounded-full">
                  <User className="h-3 w-3 text-blue-600" />
                </div>
                <span className="font-medium">{post.profiles.full_name}</span>
              </div>
            )}
            
            {post.location && (
              <div className="flex items-center gap-3 text-gray-600">
                <div className="p-1.5 bg-purple-100 rounded-full">
                  <MapPin className="h-3 w-3 text-purple-600" />
                </div>
                <span>{post.location}</span>
              </div>
            )}
            
            <div className="flex items-center gap-3 text-gray-600">
              <div className="p-1.5 bg-indigo-100 rounded-full">
                <Calendar className="h-3 w-3 text-indigo-600" />
              </div>
              <span>
                Posted {formatDistanceToNow(new Date(post.date_posted))} ago
              </span>
            </div>
            
            {post.date_lost_found && (
              <div className="flex items-center gap-3 text-gray-600">
                <div className="p-1.5 bg-orange-100 rounded-full">
                  <Calendar className="h-3 w-3 text-orange-600" />
                </div>
                <span>
                  {isLost ? 'Lost' : 'Found'} on {new Date(post.date_lost_found).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
          
          {post.status === 'active' && (
            <>
              {!isMaskedContact ? (
                <Button 
                  onClick={() => onContact(post.contact_info)}
                  className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transition-all duration-200"
                  variant="outline"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Owner
                </Button>
              ) : (
                <div className="w-full mt-6 p-3 bg-gray-100 border border-gray-200 rounded-lg text-center">
                  <Mail className="h-4 w-4 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Sign in to view contact information
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
