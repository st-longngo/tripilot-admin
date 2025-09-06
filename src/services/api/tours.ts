import { ApiService } from './base';
import { Tour } from '@/types/api';
import { TourQuickCreateFormData } from '@/types/forms';

export interface GetToursParams {
  page?: number;
  pageSize?: number;
}

export interface AssignParticipantsData {
  userIds: string[];
}

export interface TourParticipant {
  id: string;
  tourId: string;
  userId: string;
  registrationDate: string;
  status: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  specialRequirements: string;
  dietaryRestrictions: string;
  medicalConditions: string;
  roomPreference: string;
  transportationNeeds: string;
  paymentStatus: string;
  amountPaid: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    phone: string;
    role: string;
    avatarUrl?: string;
  };
}

export class TourService extends ApiService {
  async getTours(params: GetToursParams = {}): Promise<Tour[]> {
    // Call the API endpoint as specified
    const response = await this.get<Tour[]>('/api/tours', params);
    // Since API returns array directly, we need to handle this properly
    return (response as unknown as Tour[]) || [];
  }

  async getTour(id: string): Promise<Tour> {
    const response = await this.get<Tour>(`/api/tours/${id}`);
    return response as unknown as Tour;
  }

  async createTour(data: TourQuickCreateFormData): Promise<Tour> {
    const response = await this.post<Tour>('/api/tours', data);
    return response as unknown as Tour;
  }

  async updateTour(id: string, data: TourQuickCreateFormData): Promise<Tour> {
    const response = await this.patch<Tour>(`/api/tours/${id}`, data);
    return response as unknown as Tour;
  }

  async deleteTour(id: string): Promise<void> {
    await this.delete(`/api/tours/${id}`);
  }

  async assignParticipants(tourId: string, data: AssignParticipantsData): Promise<void> {
    await this.post(`/api/tours/${tourId}/participants`, data);
  }

  async getTourParticipants(tourId: string): Promise<TourParticipant[]> {
    const response = await this.get<TourParticipant[]>(`/api/tours/${tourId}/participants`);
    return response as unknown as TourParticipant[];
  }
}

export const tourService = new TourService();
