import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cafeService } from '../api/cafeService';
import type { CreateCafePayload, UpdateCafePayload } from '../api/types';

export const useCafes = (location?: string) =>
  useQuery({
    queryKey: ['cafes', location],
    queryFn: () => cafeService.getAll(location),
  });

export const useCreateCafe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCafePayload) => cafeService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cafes'] }),
  });
};

export const useUpdateCafe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateCafePayload) => cafeService.update(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cafes'] }),
  });
};

export const useDeleteCafe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cafeService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cafes'] }),
  });
};
