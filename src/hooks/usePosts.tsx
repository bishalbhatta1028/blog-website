import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchPosts, addPost, updatePost, deletePost } from '@/store/slices/postsSlice';
import { toast } from 'sonner';

export const usePosts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error } = useSelector((state: RootState) => state.posts);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPosts());
    }
  }, [status, dispatch]);

  const create = async (data: { title: string; content: string; excerpt?: string; image?: string; category?: string }) => {
    if (!userId) {
      toast.error('User not authenticated');
      return;
    }

    try {
      await dispatch(addPost({ ...data, author_id: userId })).unwrap();
      toast.success('Post created successfully!');
    } catch (error: any) {
      toast.error(error || 'Failed to create post');
      throw error;
    }
  };

  const edit = async (id: string, data: { title: string; content: string; excerpt?: string; image?: string; category?: string }) => {
    try {
      await dispatch(updatePost({ id, data })).unwrap();
      toast.success('Post updated successfully!');
    } catch (error: any) {
      toast.error(error || 'Failed to update post');
      throw error;
    }
  };

  const remove = async (id: string) => {
    try {
      await dispatch(deletePost(id)).unwrap();
      toast.success('Post deleted successfully!');
    } catch (error: any) {
      toast.error(error || 'Failed to delete post');
      throw error;
    }
  };

  return {
    posts: items,
    status,
    error,
    create,
    edit,
    remove,
    isLoading: status === 'loading',
  };
};