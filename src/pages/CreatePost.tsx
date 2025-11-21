import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePosts } from '@/hooks/usePosts';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, X, Plus, Upload, Image as ImageIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ReactQuillWrapper } from '@/components/ReactQuillWrapper';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const categories = ['Fintech', 'Finance Tips', 'Security', 'Budgeting', 'Technology'];

const postSchema = yup.object({
  title: yup.string().trim().required('Title is required').max(200, 'Title must be less than 200 characters'),
  excerpt: yup.string().trim().max(300, 'Excerpt must be less than 300 characters'),
  content: yup.string().trim().required('Content is required').max(10000, 'Content must be less than 10000 characters'),
  category: yup.string().required('Category is required'),
  image: yup.string().required('Image is required'),
});

interface PostFormData {
  title: string;
  excerpt?: string;
  content: string;
  category: string;
  image: string;
}

const CreatePost = () => {
  const navigate = useNavigate();
  const { create } = usePosts();
  const [availableCategories, setAvailableCategories] = useState(categories);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm<PostFormData>({
    resolver: yupResolver(postSchema) as any,
    defaultValues: { title: '', excerpt: '', content: '', category: '', image: '' },
  });

  const content = watch('content');
  const selectedCategory = watch('category');

  const handleAddCategory = () => {
    if (newCategory.trim() && !availableCategories.includes(newCategory.trim())) {
      setAvailableCategories([...availableCategories, newCategory.trim()]);
      setValue('category', newCategory.trim());
      setNewCategory('');
      setShowNewCategoryInput(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setValue('image', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setValue('image', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: PostFormData) => {
    try {
      await create(data);
      navigate('/dashboard');
    } catch (error) {
      // Error handled by usePosts hook with toast
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#2d1b4e] to-[#1a0b2e] relative overflow-hidden">
      {/* Background texture overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      
      <Navbar />
      <div className="container mx-auto max-w-4xl px-4 pt-24 pb-8 relative z-10">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6 text-white hover:bg-white/10 font-poppins"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-urbanist">Create New Post</h1>
            <p className="text-white/80 text-sm md:text-base font-poppins">Share your thoughts with the world</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white font-poppins font-medium">Title *</Label>
              <Input
                id="title"
                placeholder="Enter your post title"
                {...register('title')}
                className={`font-poppins bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-blue-400 ${
                  errors.title ? 'border-red-400' : ''
                }`}
              />
              {errors.title && (
                <p className="text-sm text-red-300 font-poppins">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt" className="text-white font-poppins font-medium">Excerpt (optional)</Label>
              <Input
                id="excerpt"
                placeholder="A brief summary of your post"
                {...register('excerpt')}
                className={`font-poppins bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-blue-400 ${
                  errors.excerpt ? 'border-red-400' : ''
                }`}
              />
              {errors.excerpt && (
                <p className="text-sm text-red-300 font-poppins">{errors.excerpt.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-white font-poppins font-medium">Category *</Label>
              <div className="flex gap-2">
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => {
                    if (value === 'new') {
                      setShowNewCategoryInput(true);
                    } else {
                      setValue('category', value);
                      setShowNewCategoryInput(false);
                    }
                  }}
                >
                  <SelectTrigger className={`font-poppins bg-white/10 border-white/20 text-white focus:border-blue-400 focus:ring-blue-400 ${
                    errors.category ? 'border-red-400' : ''
                  }`}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2d1b4e] border-white/20 text-white">
                    {availableCategories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="font-poppins text-white focus:bg-white/10 focus:text-white">
                        {cat}
                      </SelectItem>
                    ))}
                    <SelectItem value="new" className="font-poppins text-blue-400 focus:bg-white/10">
                      <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add New Category
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {showNewCategoryInput && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter new category name"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="font-poppins bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-blue-400"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCategory();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleAddCategory}
                    className="bg-white text-[#1a0b2e] hover:bg-white/90 font-poppins font-medium"
                  >
                    Add
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowNewCategoryInput(false);
                      setNewCategory('');
                    }}
                    className="border-white/20 text-white hover:bg-white/10 font-poppins"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {errors.category && (
                <p className="text-sm text-red-300 font-poppins">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="text-white font-poppins font-medium">Featured Image *</Label>
              <div className="space-y-3">
                {!imagePreview ? (
                  <div className="relative">
                    <input
                      ref={fileInputRef}
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="image"
                      className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/30 rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 mb-3 text-white/60" />
                        <p className="mb-2 text-sm font-poppins text-white/80">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs font-poppins text-white/60">PNG, JPG, GIF up to 5MB</p>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="relative w-full rounded-lg overflow-hidden border border-white/20">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600/80 text-white border-red-400 font-poppins"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                    {imageFile && (
                      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs font-poppins px-2 py-1 rounded">
                        {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
                      </div>
                    )}
                  </div>
                )}
              </div>
              {errors.image && (
                <p className="text-sm text-red-300 font-poppins">{errors.image.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-white font-poppins font-medium">Content *</Label>
              <div className="bg-white rounded-lg">
                <style>{`
                  .ql-container {
                    min-height: 400px;
                    font-size: 16px;
                  }
                  .ql-editor {
                    min-height: 400px;
                  }
                `}</style>
                <ReactQuillWrapper
                  value={content}
                  onChange={(value) => setValue('content', value)}
                  className={errors.content ? 'border-red-400 rounded-md' : ''}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      ['link', 'image'],
                      ['clean'],
                    ],
                  }}
                />
              </div>
              {errors.content && (
                <p className="text-sm text-red-300 font-poppins">{errors.content.message}</p>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-white dark:bg-white text-[#1a0b2e] dark:text-[#1a0b2e] hover:bg-white/90 dark:hover:bg-white/90 font-poppins font-medium h-12"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Post'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="border-blue-400 dark:border-blue-400 bg-white dark:bg-white text-black dark:text-black hover:bg-blue-400/10 dark:hover:bg-blue-400/10 font-poppins font-medium h-12"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;