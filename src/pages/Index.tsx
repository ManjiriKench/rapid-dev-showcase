
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar onCreatePost={() => setShowPostForm(true)} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="relative">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Lost & Found Community
            </h1>
            <div className="absolute -top-2 -left-4 text-6xl opacity-20">🔍</div>
            <div className="absolute -top-4 -right-8 text-4xl opacity-20">💝</div>
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Help reunite people with their lost items or find the owner of something you found
          </p>
          
          {!user && (
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-lg max-w-md mx-auto">
              <div className="text-4xl mb-4">🤝</div>
              <p className="text-gray-600 mb-6">
                Join our community to post lost or found items
              </p>
              <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                <a href="/auth">Sign Up / Sign In</a>
              </Button>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <SearchFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onClearFilters={clearFilters}
          />
        </div>

        {/* Posts Grid */}
        <div className="mt-8">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto shadow-lg border border-white/20">
                <div className="text-8xl mb-6">🔍</div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">No items found</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {posts.length === 0 
                    ? "Be the first to post a lost or found item!" 
                    : "Try adjusting your search filters."
                  }
                </p>
                {user && posts.length === 0 && (
                  <Button 
                    onClick={() => setShowPostForm(true)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Post First Item
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
