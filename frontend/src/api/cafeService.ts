import api from './client';
import type { CafeDto, CreateCafePayload, UpdateCafePayload } from './types';

export const cafeService = {
  getAll: async (location?: string): Promise<CafeDto[]> => {
    const params = location ? { location } : {};
    const { data } = await api.get<CafeDto[]>('/cafes', { params });
    return data;
  },

  create: async (payload: CreateCafePayload): Promise<{ id: string }> => {
    const { data } = await api.post('/cafe', payload);
    return data;
  },

  update: async (payload: UpdateCafePayload): Promise<void> => {
    await api.put('/cafe', payload);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete('/cafe', { params: { id } });
  },
};
