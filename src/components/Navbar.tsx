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
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-foreground">
          Lost & Found
        </Link>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onCreatePost}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Post Item
              </Button>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user.email}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  Sign Out
                </Button>
              </div>
            </>
          ) : (
            <Link to="/auth">
              <Button variant="default" size="sm">
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