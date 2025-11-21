import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePosts } from '@/hooks/usePosts';
import { Navbar } from '@/components/Navbar';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Helper function to create slug from title
const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Helper function to find post by slug
const findPostBySlug = (posts: any[], slug: string) => {
  return posts.find((post) => createSlug(post.title) === slug);
};

const BlogPostDetail = () => {
  const { title } = useParams<{ title: string }>();
  const { posts, isLoading } = usePosts();
  const navigate = useNavigate();

  const post = title ? findPostBySlug(posts, title) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 dark:border-gray-600 border-t-[#1a0b2e] dark:border-t-purple-400" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 font-urbanist text-gray-900 dark:text-white">Post not found</h1>
            <Button onClick={() => navigate('/')} className="font-poppins">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate reading time (average 200 words per minute)
  const wordCount = post.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  // Format date
  let formattedDate = 'Date not available';
  try {
    formattedDate = format(new Date(post.created_at), 'MMMM dd, yyyy');
  } catch (e) {
    formattedDate = post.created_at || 'Date not available';
  }

  // Get author name
  const authorName = post.profiles?.full_name || 'Anonymous';
  const authorEmail = post.profiles?.email || '';
  const authorInitials = authorName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Create slug from title for URL
  const titleSlug = post.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 font-poppins">
            <Link to="/" className="hover:text-[#1a0b2e] dark:hover:text-purple-300 transition-colors">
              Blog
            </Link>
            <span>/</span>
            <span className="text-[#1a0b2e] dark:text-purple-300 font-medium">{post.title}</span>
          </div>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 font-urbanist leading-tight">
            {post.title}
          </h1>

          {/* Author Info */}
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-gradient-to-br from-[#1a0b2e] to-[#2d1b4e] text-white font-semibold font-poppins">
                {authorInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="font-semibold text-gray-900 dark:text-white font-poppins">{authorName}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-poppins">
                  <Calendar className="h-4 w-4" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-poppins">
                  <Clock className="h-4 w-4" />
                  <span>{readingTime} min read</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.image && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-auto object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1200x600?text=Blog+Image';
              }}
            />
          </div>
        )}

        {/* Article Content */}
        <article className="mb-12">
          <div
            className="text-gray-700 dark:text-gray-300 leading-relaxed font-poppins blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
            style={{
              fontSize: '18px',
              lineHeight: '1.8',
            }}
          />
          <style>{`
            .blog-content h1,
            .blog-content h2,
            .blog-content h3 {
              font-family: 'Urbanist', sans-serif;
              font-weight: 700;
              margin-top: 2rem;
              margin-bottom: 1rem;
              color: #1a0b2e;
            }
            .dark .blog-content h1,
            .dark .blog-content h2,
            .dark .blog-content h3 {
              color: #a78bfa;
            }
            .blog-content h1 {
              font-size: 2rem;
            }
            .blog-content h2 {
              font-size: 1.75rem;
            }
            .blog-content h3 {
              font-size: 1.5rem;
            }
            .blog-content p {
              margin-bottom: 1.5rem;
            }
            .blog-content ul,
            .blog-content ol {
              margin-left: 2rem;
              margin-bottom: 1.5rem;
            }
            .blog-content li {
              margin-bottom: 0.5rem;
            }
            .blog-content a {
              color: #1a0b2e;
              text-decoration: underline;
            }
            .dark .blog-content a {
              color: #a78bfa;
            }
            .blog-content a:hover {
              color: #2d1b4e;
            }
            .dark .blog-content a:hover {
              color: #c4b5fd;
            }
            .blog-content img {
              max-width: 100%;
              height: auto;
              border-radius: 8px;
              margin: 2rem 0;
            }
            .blog-content blockquote {
              border-left: 4px solid #1a0b2e;
              padding-left: 1.5rem;
              margin: 2rem 0;
              font-style: italic;
              color: #4b5563;
            }
            .dark .blog-content blockquote {
              border-left-color: #a78bfa;
              color: #d1d5db;
            }
          `}</style>
        </article>

        {/* Back Button */}
        <div className="flex justify-start mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 font-poppins border-[#1a0b2e] text-[#1a0b2e] hover:bg-gradient-to-r hover:from-[#1a0b2e] hover:via-[#2d1b4e] hover:to-[#1a0b2e] hover:text-white dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-500 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogPostDetail;

