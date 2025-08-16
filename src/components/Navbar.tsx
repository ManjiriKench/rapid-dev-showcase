
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Search, Plus, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onCreatePost?: () => void;
}

const Navbar = ({ onCreatePost }: NavbarProps) => {
  const { user, signOut } = useAuth();

  return (
    <nav className="border-b bg-white/80 backdrop-blur-sm border-white/20 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Lost & Found
        </Link>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onCreatePost}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 hover:from-green-600 hover:to-emerald-700 shadow-sm"
              >
                <Plus className="h-4 w-4" />
                Post Item
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
                  <div className="p-1 bg-blue-100 rounded-full">
                    <User className="h-3 w-3 text-blue-600" />
                  </div>
                  <span className="hidden sm:inline text-sm font-medium text-blue-800">{user.email}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={signOut}
                  className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                >
                  Sign Out
                </Button>
              </div>
            </>
          ) : (
            <Link to="/auth">
              <Button 
                variant="default" 
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-sm"
              >
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
