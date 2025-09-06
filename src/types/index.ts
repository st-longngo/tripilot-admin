// Core Types for TripSync Admin
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'operator' | 'guide';
  avatar?: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
}

export interface Tour {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  capacity: number;
  currentParticipants: number;
  price: number;
  status: 'draft' | 'published' | 'active' | 'completed' | 'cancelled';
  category: string;
  destination: string;
  operator: string;
  guide?: string;
  itinerary: ItineraryItem[];
  participants: Participant[];
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ItineraryItem {
  id: string;
  day: number;
  title: string;
  description: string;
  activities: Activity[];
  accommodation?: Accommodation;
  transportation?: Transportation;
  meals: ('breakfast' | 'lunch' | 'dinner')[];
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  location: Location;
  type: 'sightseeing' | 'adventure' | 'cultural' | 'leisure' | 'meal';
  cost?: number;
}

export interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  nationality: string;
  passportNumber?: string;
  emergencyContact: EmergencyContact;
  medicalInfo?: MedicalInfo;
  dietaryRestrictions?: string[];
  documents: Document[];
  tours: string[];
  status: 'pending' | 'confirmed' | 'checked_in' | 'completed';
  createdAt: Date;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface MedicalInfo {
  conditions: string[];
  medications: string[];
  allergies: string[];
  bloodType?: string;
  insuranceNumber?: string;
}

export interface Document {
  id: string;
  type: 'passport' | 'visa' | 'insurance' | 'medical' | 'other';
  name: string;
  url: string;
  uploadedAt: Date;
  expiryDate?: Date;
}

export interface Transportation {
  id: string;
  type: 'bus' | 'car' | 'plane' | 'train' | 'boat';
  provider: string;
  vehicleNumber?: string;
  capacity: number;
  driver?: Driver;
  route: Location[];
  departureTime: Date;
  arrivalTime: Date;
  cost: number;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  experience: number;
  rating: number;
}

export interface Accommodation {
  id: string;
  name: string;
  type: 'hotel' | 'resort' | 'hostel' | 'guesthouse' | 'camping';
  address: string;
  location: Location;
  rating: number;
  amenities: string[];
  rooms: Room[];
  contact: ContactInfo;
  checkIn: Date;
  checkOut: Date;
}

export interface Room {
  id: string;
  type: string;
  capacity: number;
  price: number;
  amenities: string[];
  participants?: string[];
}

export interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: 'destination' | 'poi' | 'accommodation' | 'transport_hub';
}

export interface ContactInfo {
  name: string;
  phone: string;
  email: string;
}

export interface DashboardMetrics {
  activeTours: number;
  totalParticipants: number;
  monthlyRevenue: number;
  customerSatisfaction: number;
  trendsData: {
    revenue: ChartDataPoint[];
    bookings: ChartDataPoint[];
    toursByCategory: CategoryData[];
  };
}

export interface ChartDataPoint {
  label: string;
  value: number;
  date?: Date;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  data: T;
  total?: number;
  page?: number;
  limit?: number;
  hasMore?: boolean;
}

export interface SearchFilters {
  query?: string;
  status?: string;
  category?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  priceRange?: {
    min: number;
    max: number;
  };
}
