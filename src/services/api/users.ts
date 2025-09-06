import { ApiService } from './base';
import { User } from '@/types/api';
import { UserFormData } from '@/types/forms';

export interface GetUsersParams {
  page?: number;
  pageSize?: number;
}

export class UserService extends ApiService {
  async getUsers(params: GetUsersParams = {}): Promise<User[]> {
    const response = await this.get<User[]>('/api/users', params);
    return (response as unknown as User[]) || [];
  }

  async getUser(id: string): Promise<User> {
    const response = await this.get<User>(`/api/users/${id}`);
    return response as unknown as User;
  }

  async createUser(data: UserFormData): Promise<User> {
    const response = await this.post<User>('/api/users', data);
    return response as unknown as User;
  }

  async updateUser(id: string, data: UserFormData): Promise<User> {
    const response = await this.put<User>(`/api/users/${id}`, data);
    return response as unknown as User;
  }

  async deleteUser(id: string): Promise<void> {
    await this.delete(`/api/users/${id}`);
  }
}

export const userService = new UserService();