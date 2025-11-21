import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Navbar } from '@/components/Navbar';
import { Eye, EyeOff } from 'lucide-react';

const loginSchema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const registerSchema = yup.object({
  fullName: yup.string().min(2, 'Full name must be at least 2 characters').required('Full name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Auth = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  const [isLogin, setIsLogin] = useState(mode !== 'signup');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login, register, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Sync with URL parameter
  useEffect(() => {
    if (mode === 'signup') {
      setIsLogin(false);
    } else if (mode === 'login' || !mode) {
      setIsLogin(true);
    }
  }, [mode]);

  const loginForm = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema) as any,
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema) as any,
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
  });

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, navigate]);

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch (error) {
      // Error handled by useAuth hook with toast
    }
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    try {
      const { confirmPassword, ...registerData } = data;
      await register(registerData);
    } catch (error) {
      // Error handled by useAuth hook with toast
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#2d1b4e] to-[#1a0b2e] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#2d1b4e] to-[#1a0b2e] relative overflow-hidden">
      {/* Background texture overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      
      <Navbar />
      
      <div className="flex min-h-screen items-center justify-center p-4 pt-24 relative z-10">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-urbanist">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-white/80 text-sm md:text-base font-poppins">
                {isLogin
                  ? 'Enter your credentials to access your blog'
                  : 'Sign up to start creating your blog posts'}
              </p>
            </div>

            {/* Form */}
            <div>
              {isLogin ? (
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-white font-poppins font-medium">
                      Email
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      {...loginForm.register('email')}
                      className={`font-poppins bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-blue-400 ${
                        loginForm.formState.errors.email ? 'border-red-400' : ''
                      }`}
                    />
                    {loginForm.formState.errors.email && (
                      <p className="text-sm text-red-300 font-poppins">
                        {loginForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-white font-poppins font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showLoginPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        {...loginForm.register('password')}
                        className={`font-poppins bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-blue-400 pr-10 ${
                          loginForm.formState.errors.password ? 'border-red-400' : ''
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        {showLoginPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-red-300 font-poppins">
                        {loginForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-white text-[#1a0b2e] hover:bg-white/90 font-poppins font-medium h-12"
                    disabled={loginForm.formState.isSubmitting}
                  >
                    {loginForm.formState.isSubmitting ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              ) : (
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="register-fullName" className="text-white font-poppins font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="register-fullName"
                      placeholder="John Doe"
                      {...registerForm.register('fullName')}
                      className={`font-poppins bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-blue-400 ${
                        registerForm.formState.errors.fullName ? 'border-red-400' : ''
                      }`}
                    />
                    {registerForm.formState.errors.fullName && (
                      <p className="text-sm text-red-300 font-poppins">
                        {registerForm.formState.errors.fullName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-white font-poppins font-medium">
                      Email
                    </Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="you@example.com"
                      {...registerForm.register('email')}
                      className={`font-poppins bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-blue-400 ${
                        registerForm.formState.errors.email ? 'border-red-400' : ''
                      }`}
                    />
                    {registerForm.formState.errors.email && (
                      <p className="text-sm text-red-300 font-poppins">
                        {registerForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-white font-poppins font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        type={showRegisterPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        {...registerForm.register('password')}
                        className={`font-poppins bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-blue-400 pr-10 ${
                          registerForm.formState.errors.password ? 'border-red-400' : ''
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        {showRegisterPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {registerForm.formState.errors.password && (
                      <p className="text-sm text-red-300 font-poppins">
                        {registerForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-confirmPassword" className="text-white font-poppins font-medium">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="register-confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        {...registerForm.register('confirmPassword')}
                        className={`font-poppins bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-blue-400 pr-10 ${
                          registerForm.formState.errors.confirmPassword ? 'border-red-400' : ''
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-300 font-poppins">
                        {registerForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-white text-[#1a0b2e] hover:bg-white/90 font-poppins font-medium h-12"
                    disabled={registerForm.formState.isSubmitting}
                  >
                    {registerForm.formState.isSubmitting ? 'Creating account...' : 'Sign Up'}
                  </Button>
                </form>
              )}
              
              {/* Toggle between Login and Sign Up */}
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => {
                    const newMode = isLogin ? 'signup' : 'login';
                    setIsLogin(!isLogin);
                    setSearchParams({ mode: newMode });
                    loginForm.reset();
                    registerForm.reset();
                  }}
                  className="text-white/80 hover:text-white text-sm font-poppins transition-colors underline underline-offset-4"
                >
                  {isLogin
                    ? "Don't have an account? Sign up"
                    : 'Already have an account? Sign in'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;