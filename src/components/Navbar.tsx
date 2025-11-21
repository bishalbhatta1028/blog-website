import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { FileText, PenSquare, LogOut, Home, Menu, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from '@/components/ui/sheet';

export const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isHomePage = location.pathname === '/';
  const isDashboardPage = location.pathname.startsWith('/dashboard') || 
                          location.pathname.startsWith('/create') || 
                          location.pathname.startsWith('/edit');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full">
      <div className="container mx-auto px-4 py-4">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 md:px-6 py-3 flex items-center justify-between">
          {/* Logo - Smaller on mobile */}
          <Link to="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
            <div className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-lg bg-white text-[#1a0b2e] font-bold text-sm md:text-lg font-urbanist">
              V
            </div>
            <span className="text-base md:text-xl font-bold font-urbanist text-white">Vynspire Blogs</span>
          </Link>

          {/* Desktop Navigation Links */}
          {isAuthenticated && isDashboardPage ? (
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 text-white hover:text-white/80 font-poppins text-sm font-medium transition-colors ${
                  location.pathname === '/dashboard' ? 'text-white font-semibold' : ''
                }`}
              >
                <FileText className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                to="/create"
                className={`flex items-center gap-2 text-white hover:text-white/80 font-poppins text-sm font-medium transition-colors ${
                  location.pathname === '/create' ? 'text-white font-semibold' : ''
                }`}
              >
                <PenSquare className="h-4 w-4" />
                Create Blog
              </Link>
              <Link
                to="/"
                className="flex items-center gap-2 text-white hover:text-white/80 font-poppins text-sm font-medium transition-colors"
              >
                <Home className="h-4 w-4" />
                All Blogs
              </Link>
            </div>
          ) : !isAuthenticated ? (
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-white hover:text-white/80 font-poppins text-sm font-medium transition-colors">
                Home
              </Link>
              <Link to="/" className="text-white hover:text-white/80 font-poppins text-sm font-medium transition-colors">
                Services
              </Link>
              <Link to="/" className="text-white hover:text-white/80 font-poppins text-sm font-medium transition-colors">
                Pricing
              </Link>
              <Link to="/" className="text-white hover:text-white/80 font-poppins text-sm font-medium transition-colors">
                News
              </Link>
              <Link to="/" className="text-white hover:text-white/80 font-poppins text-sm font-medium transition-colors">
                Contact
              </Link>
            </div>
          ) : null}

          {/* Right Side - Action Buttons */}
          <div className="flex items-center gap-2 md:gap-3">
            {isAuthenticated ? (
              <>
                {/* Mobile: Icon only, Desktop: Full button */}
                {!isDashboardPage && (
                  <Link to="/dashboard" className="md:hidden">
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-white text-black hover:bg-white/90 font-poppins font-medium p-2 md:px-4"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
                {!isDashboardPage && (
                  <Link to="/dashboard" className="hidden md:block">
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-white text-black hover:bg-white/90 font-poppins font-medium px-4"
                    >
                      Dashboard
                    </Button>
                  </Link>
                )}
                {/* Mobile: Icon only, Desktop: With text */}
                <Button
                  onClick={logout}
                  variant="outline"
                  size="sm"
                  className="border-blue-400 text-black hover:bg-blue-400/10 font-poppins font-medium p-2 md:px-4 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden md:inline">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth?mode=login" className="hidden md:block">
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-white text-black hover:bg-white/90 font-poppins font-medium px-4"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/auth?mode=signup" className="hidden md:block">
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-white text-black hover:bg-white/90 font-poppins font-medium px-4"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden text-white hover:bg-white/10 p-2"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-gradient-to-br from-[#1a0b2e] via-[#2d1b4e] to-[#1a0b2e] border-white/20 w-[280px]">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col h-full">
                  {/* Mobile Menu Header */}
                  <div className="flex items-center justify-between mb-8">
                    <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white text-[#1a0b2e] font-bold text-lg font-urbanist">
                        V
                      </div>
                      <span className="text-xl font-bold font-urbanist text-white">Vynspire Blogs</span>
                    </Link>
                    <SheetClose asChild>
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 p-2">
                        <X className="h-5 w-5" />
                      </Button>
                    </SheetClose>
                  </div>

                  {/* Mobile Menu Links */}
                  <div className="flex flex-col gap-4 flex-1">
                    {isAuthenticated && isDashboardPage ? (
                      <>
                        <Link
                          to="/dashboard"
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 text-white hover:text-white/80 font-poppins text-base font-medium transition-colors p-3 rounded-lg hover:bg-white/10 ${
                            location.pathname === '/dashboard' ? 'bg-white/10 font-semibold' : ''
                          }`}
                        >
                          <FileText className="h-5 w-5" />
                          Dashboard
                        </Link>
                        <Link
                          to="/create"
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 text-white hover:text-white/80 font-poppins text-base font-medium transition-colors p-3 rounded-lg hover:bg-white/10 ${
                            location.pathname === '/create' ? 'bg-white/10 font-semibold' : ''
                          }`}
                        >
                          <PenSquare className="h-5 w-5" />
                          Create Blog
                        </Link>
                        <Link
                          to="/"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 text-white hover:text-white/80 font-poppins text-base font-medium transition-colors p-3 rounded-lg hover:bg-white/10"
                        >
                          <Home className="h-5 w-5" />
                          All Blogs
                        </Link>
                      </>
                    ) : !isAuthenticated ? (
                      <>
                        <Link
                          to="/"
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-white hover:text-white/80 font-poppins text-base font-medium transition-colors p-3 rounded-lg hover:bg-white/10"
                        >
                          Home
                        </Link>
                        <Link
                          to="/"
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-white hover:text-white/80 font-poppins text-base font-medium transition-colors p-3 rounded-lg hover:bg-white/10"
                        >
                          Services
                        </Link>
                        <Link
                          to="/"
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-white hover:text-white/80 font-poppins text-base font-medium transition-colors p-3 rounded-lg hover:bg-white/10"
                        >
                          Pricing
                        </Link>
                        <Link
                          to="/"
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-white hover:text-white/80 font-poppins text-base font-medium transition-colors p-3 rounded-lg hover:bg-white/10"
                        >
                          News
                        </Link>
                        <Link
                          to="/"
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-white hover:text-white/80 font-poppins text-base font-medium transition-colors p-3 rounded-lg hover:bg-white/10"
                        >
                          Contact
                        </Link>
                      </>
                    ) : null}

                    {/* Mobile Auth Buttons */}
                    {!isAuthenticated && (
                      <div className="mt-auto pt-6 border-t border-white/20 space-y-3">
                        <Link to="/auth?mode=login" onClick={() => setMobileMenuOpen(false)}>
                          <Button
                            variant="default"
                            size="sm"
                            className="w-full bg-white text-black hover:bg-white/90 font-poppins font-medium"
                          >
                            Login
                          </Button>
                        </Link>
                        <Link to="/auth?mode=signup" onClick={() => setMobileMenuOpen(false)}>
                          <Button
                            variant="default"
                            size="sm"
                            className="w-full bg-white text-black hover:bg-white/90 font-poppins font-medium"
                          >
                            Sign Up
                          </Button>
                        </Link>
                      </div>
                    )}

                    {/* Mobile Logout Button */}
                    {isAuthenticated && (
                      <div className="mt-auto pt-6 border-t border-white/20">
                        <Button
                          onClick={() => {
                            logout();
                            setMobileMenuOpen(false);
                          }}
                          variant="outline"
                          size="sm"
                          className="w-full border-blue-400 text-black hover:bg-blue-400/10 font-poppins font-medium flex items-center justify-center gap-2"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};