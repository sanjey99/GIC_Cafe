import api from './client';
import type { EmployeeDto, CreateEmployeePayload, UpdateEmployeePayload } from './types';

export const employeeService = {
  getAll: async (cafe?: string): Promise<EmployeeDto[]> => {
    const params = cafe ? { cafe } : {};
    const { data } = await api.get<EmployeeDto[]>('/employees', { params });
    return data;
  },

  create: async (payload: CreateEmployeePayload): Promise<{ id: string }> => {
    const { data } = await api.post('/employee', payload);
    return data;
  },

  update: async (payload: UpdateEmployeePayload): Promise<void> => {
    await api.put('/employee', payload);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete('/employee', { params: { id } });
  },
};
