import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { usePosts } from '@/hooks/usePosts';
import { format } from 'date-fns';

interface Blog {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
}

export const BlogSection = () => {
  const { posts, isLoading } = usePosts();
  const [selectedCategory, setSelectedCategory] = useState('All Articles');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

  // Transform posts to blog format
  const blogs: Blog[] = useMemo(() => {
    return posts.map((post) => {
      let formattedDate = 'Date not available';
      try {
        formattedDate = format(new Date(post.created_at), 'MMMM dd, yyyy');
      } catch (e) {
        // If date parsing fails, use the original string or a default
        formattedDate = post.created_at || 'Date not available';
      }

      return {
        id: post.id,
        title: post.title,
        category: post.category || 'Uncategorized',
        date: formattedDate,
        image: post.image || 'https://via.placeholder.com/800x600?text=Blog+Image',
        excerpt: post.excerpt || (post.content ? post.content.substring(0, 150) + '...' : 'No excerpt available'),
      };
    });
  }, [posts]);

  // Get unique categories from posts
  const categories = useMemo(() => {
    const uniqueCategories = ['All Articles', ...new Set(blogs.map((blog) => blog.category).filter(Boolean))];
    return uniqueCategories;
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    let filtered = blogs;

    // Filter by category
    if (selectedCategory !== 'All Articles') {
      filtered = filtered.filter((blog) => blog.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(query) ||
          blog.excerpt.toLowerCase().includes(query) ||
          blog.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [blogs, selectedCategory, searchQuery]);

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const startIndex = (currentPage - 1) * blogsPerPage;
  const endIndex = startIndex + blogsPerPage;
  const currentBlogs = filteredBlogs.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  if (isLoading) {
    return (
      <section className="bg-white py-16 lg:py-24 relative z-20">
        <div className="container mx-auto px-4 relative z-20">
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[#1a0b2e]" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16 lg:py-24 relative z-20">
      <div className="container mx-auto px-4 relative z-20">
        {/* Search Bar */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 font-poppins border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedCategory(category);
                }}
                style={{ pointerEvents: 'auto', zIndex: 10 }}
                className={`font-poppins font-medium rounded-full px-6 py-2 transition-all cursor-pointer relative z-10 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#1a0b2e] via-[#2d1b4e] to-[#1a0b2e] text-white hover:from-[#2d1b4e] hover:via-[#3d2b5e] hover:to-[#2d1b4e] border-0'
                    : 'bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-[#1a0b2e] hover:via-[#2d1b4e] hover:to-[#1a0b2e] hover:text-white border border-gray-300'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Blog Grid */}
        {currentBlogs.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {currentBlogs.map((blog) => (
                <Card key={blog.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video overflow-hidden bg-gray-100">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Blog+Image';
                      }}
                    />
                  </div>
                  <CardContent className="p-6">
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full mb-3 font-poppins">
                      {blog.category}
                    </span>
                    <h3 className="text-xl font-bold mb-2 font-urbanist text-gray-900 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 font-poppins">{blog.date}</p>
                    <p className="text-gray-600 text-sm line-clamp-3 font-poppins">{blog.excerpt}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentPage((prev) => Math.max(1, prev - 1));
                  }}
                  disabled={currentPage === 1}
                  style={{ pointerEvents: 'auto', zIndex: 10 }}
                  className="font-poppins px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1 relative z-10"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      const isActive = currentPage === page;
                      return (
                        <button
                          key={page}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setCurrentPage(page);
                          }}
                          style={{ pointerEvents: 'auto', zIndex: 10 }}
                          className={`font-poppins px-4 py-2 rounded-md transition-all relative z-10 ${
                            isActive
                              ? 'bg-gradient-to-r from-[#1a0b2e] via-[#2d1b4e] to-[#1a0b2e] text-white hover:from-[#2d1b4e] hover:via-[#3d2b5e] hover:to-[#2d1b4e] border-0'
                              : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="px-2 text-gray-500">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                  }}
                  disabled={currentPage === totalPages}
                  style={{ pointerEvents: 'auto', zIndex: 10 }}
                  className="font-poppins px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1 relative z-10"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg font-poppins">No articles found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
};
