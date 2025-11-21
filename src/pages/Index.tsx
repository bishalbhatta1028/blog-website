import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PenSquare, BookOpen } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';
import { BlogSection } from '@/components/BlogSection';

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-gradient-to-br from-[#1a0b2e] via-[#2d1b4e] to-[#1a0b2e] relative overflow-hidden">
      {/* Background texture overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      
      <Navbar />
      
      {/* Hero Section */}
      <div className="container min-h-screen flex items-center px-4 pt-24 lg:pt-28 pb-0 relative z-0">
        <div className="grid lg:grid-cols-2 gap-12 w-full">
          {/* Left Side - Content */}
          <div className="text-white font-urbanist flex flex-col justify-center">
            <h1 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white font-urbanist">
              Effortless Blogging Solutions
              <span className="block mt-2">For A Digital World</span>
            </h1>
            
            <p className="mb-8 text-lg md:text-xl text-white/80 max-w-xl font-poppins">
              The future of content creation at your fingertips—secure, smart, and seamless. 
              Share your stories with the world effortlessly.
            </p>

            <div className="flex flex-wrap gap-4">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard">
                    <Button size="lg" className="bg-white text-[#1a0b2e] hover:bg-white/90 gap-2 font-poppins font-medium">
                      <BookOpen className="h-5 w-5" />
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Link to="/create">
                    <Button size="lg" variant="outline" className="border-blue-400 text-black hover:bg-blue-400/10 gap-2 font-poppins font-medium">
                      <PenSquare className="h-5 w-5" />
                      Write a Post
                    </Button>
                  </Link>
                </>
              ) : (
                <Link to="/auth">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="font-poppins font-medium h-12 px-6 border-blue-400 text-black hover:bg-blue-400/10"
                  >
                    Get Started Today
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Right Side - Networking Image */}
          <div className="relative flex justify-center lg:justify-end items-end h-full self-end">
            <img 
              src="/images/it networking.svg" 
              alt="IT Networking" 
              className="w-full max-w-2xl h-auto object-contain"
            />
          </div>
        </div>
        
      </div>

      {/* Blog Section */}
      <BlogSection />
    </div>
  );
};

export default Index;
