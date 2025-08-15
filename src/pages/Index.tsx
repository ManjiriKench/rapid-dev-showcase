import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import PostForm from '@/components/PostForm';
import PostCard from '@/components/PostCard';
import SearchFilters from '@/components/SearchFilters';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

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

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      let query = supabase
        .from('posts')
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .order('date_posted', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching posts:', error);
        toast({
          title: "Failed to load posts",
          description: "Please try refreshing the page.",
          variant: "destructive"
        });
      } else {
        setPosts((data || []) as any);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContact = (contactInfo: string) => {
    // Simple contact handler - in a real app, you might want a more sophisticated system
    if (contactInfo.includes('@')) {
      window.open(`mailto:${contactInfo}`, '_blank');
    } else if (contactInfo.match(/^\d+$/)) {
      window.open(`tel:${contactInfo}`, '_blank');
    } else {
      navigator.clipboard.writeText(contactInfo);
      toast({
        title: "Contact info copied",
        description: "Contact information has been copied to your clipboard."
      });
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setStatusFilter('all');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCreatePost={() => setShowPostForm(true)} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Lost & Found Community</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Help reunite people with their lost items or find the owner of something you found
          </p>
          
          {!user && (
            <div className="bg-card p-6 rounded-lg border max-w-md mx-auto">
              <p className="text-sm text-muted-foreground mb-4">
                Join our community to post lost or found items
              </p>
              <Button asChild className="w-full">
                <a href="/auth">Sign Up / Sign In</a>
              </Button>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <SearchFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onClearFilters={clearFilters}
        />

        {/* Posts Grid */}
        <div className="mt-8">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold mb-2">No items found</h3>
              <p className="text-muted-foreground mb-4">
                {posts.length === 0 
                  ? "Be the first to post a lost or found item!" 
                  : "Try adjusting your search filters."
                }
              </p>
              {user && posts.length === 0 && (
                <Button onClick={() => setShowPostForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Post First Item
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onContact={handleContact}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Post Form Dialog */}
      <Dialog open={showPostForm} onOpenChange={setShowPostForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <PostForm
            onSuccess={() => {
              setShowPostForm(false);
              fetchPosts();
            }}
            onCancel={() => setShowPostForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
