import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSection } from '@/services/courseService';
import { toast } from 'react-toastify';

export const useCreateSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSection,
    onSuccess: () => {
      toast.success('Section created successfully');
      queryClient.invalidateQueries({
        queryKey: ['instructor-courses']
      });
    },
    onError: (error) => {
      toast.error(error.response.data.message || 'Failed to create section');
    }
  });
};
