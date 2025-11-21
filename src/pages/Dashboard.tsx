import { usePosts } from '@/hooks/usePosts';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Eye, Calendar, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { formatDistanceToNow } from 'date-fns';

const Dashboard = () => {
  const { posts, isLoading, remove } = usePosts();
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#2d1b4e] to-[#1a0b2e] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <Navbar />
        <div className="flex items-center justify-center py-20 relative z-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
        </div>
      </div>
    );
  }

  const myPosts = posts.filter((post) => post.author_id === user?.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#2d1b4e] to-[#1a0b2e] relative overflow-hidden">
      {/* Background texture overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-urbanist text-white">My Dashboard</h1>
          <p className="mt-2 text-white/80 font-poppins">
            Manage your blog posts and track your content
          </p>
        </div>

        {myPosts.length === 0 ? (
          <Card className="border-dashed bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Eye className="mb-4 h-12 w-12 text-white/60" />
              <h3 className="mb-2 text-xl font-semibold font-urbanist text-white">No posts yet</h3>
              <p className="mb-4 text-center text-white/70 font-poppins">
                Start creating amazing content for your readers
              </p>
              <Link to="/create">
                <Button className="bg-white text-[#1a0b2e] hover:bg-white/90 font-poppins font-medium">
                  Create Your First Post
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {myPosts.map((post) => (
              <Card key={post.id} className="flex flex-col transition-shadow hover:shadow-lg bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="line-clamp-2 font-urbanist text-white">{post.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-xs text-white/60 font-poppins">
                    <Calendar className="h-3 w-3" />
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="line-clamp-3 text-sm text-white/70 font-poppins">
                    {post.excerpt || post.content.substring(0, 150)}...
                  </p>
                </CardContent>
                <div className="flex gap-2 border-t border-white/20 p-4">
                  <Link to={`/edit/${post.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full border-blue-400 text-black hover:bg-blue-400/10 font-poppins">
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="font-poppins">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white/10 backdrop-blur-md border-white/20 rounded-2xl shadow-2xl max-w-md">
                      <AlertDialogHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
                          <AlertTriangle className="h-8 w-8 text-red-400" />
                        </div>
                        <AlertDialogTitle className="text-2xl font-bold font-urbanist text-white">
                          Delete Post
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-base font-poppins text-white/80 pt-2">
                          Are you sure you want to delete <span className="font-semibold text-white">"{post.title}"</span>? 
                          <br />
                          <span className="text-sm text-red-300/80 mt-2 block">This action cannot be undone.</span>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex-col sm:flex-row gap-3 sm:gap-2 mt-6">
                        <AlertDialogCancel className="w-full sm:w-auto border-white/20 text-black hover:bg-white/10 font-poppins font-medium h-11 px-6">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => remove(post.id)}
                          className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-poppins font-medium h-11 px-6 shadow-lg shadow-red-500/20"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Post
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;