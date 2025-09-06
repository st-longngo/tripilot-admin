import { ApiService } from './base';
import { Location } from '@/types/api';
import { CreateLocationFormData } from '@/types/forms';

export interface GetLocationsParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export class LocationService extends ApiService {
  async getLocations(params: GetLocationsParams = {}): Promise<Location[]> {
    const response = await this.get<Location[]>('/api/locations', params);
    return (response as unknown as Location[]) || [];
  }

  async getLocation(id: string): Promise<Location> {
    const response = await this.get<Location>(`/api/locations/${id}`);
    return response as unknown as Location;
  }

  async createLocation(data: CreateLocationFormData): Promise<Location> {
    const response = await this.post<Location>('/api/locations', data);
    return response as unknown as Location;
  }

  async updateLocation(id: string, data: CreateLocationFormData): Promise<Location> {
    const response = await this.patch<Location>(`/api/locations/${id}`, data);
    return response as unknown as Location;
  }

  async deleteLocation(id: string): Promise<void> {
    await this.delete(`/api/locations/${id}`);
  }
}

export const locationService = new LocationService();
