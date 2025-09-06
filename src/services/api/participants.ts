import { ApiService } from './base';
import { Participant, PaginationParams, SearchFilters, Document } from '@/types';

export interface GetParticipantsParams extends PaginationParams {
  filters?: SearchFilters;
}

export interface CreateParticipantData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  nationality: string;
  passportNumber?: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
}

export interface UpdateParticipantData extends Partial<CreateParticipantData> {
  status?: Participant['status'];
  medicalInfo?: {
    conditions: string[];
    medications: string[];
    allergies: string[];
    bloodType?: string;
    insuranceNumber?: string;
  };
  dietaryRestrictions?: string[];
}

export class ParticipantService extends ApiService {
  async getParticipants(params: GetParticipantsParams) {
    return this.get<Participant[]>('/participants', params);
  }

  async getParticipant(id: string) {
    return this.get<Participant>(`/participants/${id}`);
  }

  async createParticipant(data: CreateParticipantData) {
    return this.post<Participant>('/participants', data);
  }

  async updateParticipant(id: string, data: UpdateParticipantData) {
    return this.put<Participant>(`/participants/${id}`, data);
  }

  async deleteParticipant(id: string) {
    return this.delete(`/participants/${id}`);
  }

  async uploadDocument(participantId: string, file: File, documentType: Document['type']) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', documentType);

    const response = await this.client.post(
      `/participants/${participantId}/documents`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    );
    return response.data;
  }

  async deleteDocument(participantId: string, documentId: string) {
    return this.delete(`/participants/${participantId}/documents/${documentId}`);
  }

  async getParticipantHistory(id: string) {
    return this.get(`/participants/${id}/history`);
  }

  async exportParticipants(params: GetParticipantsParams) {
    return this.get<Blob>('/participants/export', params);
  }

  async importParticipants(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.client.post('/participants/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async bulkUpdateStatus(participantIds: string[], status: Participant['status']) {
    return this.patch('/participants/bulk-status', { participantIds, status });
  }
}

export const participantService = new ParticipantService();
