import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '../api/employeeService';
import type { CreateEmployeePayload, UpdateEmployeePayload } from '../api/types';

export const useEmployees = (cafe?: string) =>
  useQuery({
    queryKey: ['employees', cafe],
    queryFn: () => employeeService.getAll(cafe),
  });

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEmployeePayload) => employeeService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateEmployeePayload) => employeeService.update(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => employeeService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
  });
};
