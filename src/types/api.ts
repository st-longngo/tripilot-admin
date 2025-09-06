// types/api.ts - Enhanced API Types theo WEB_ADMIN_DESIGN.md

// ============== BASE TYPES ==============

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  lastModifiedBy?: string;
  deletedAt?: string; // Soft delete support
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// ============== USER & AUTH TYPES ==============

export type UserRole = 'customer' | 'tour_guide' | 'tour_operator' | 'admin';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  dashboard: {
    defaultView: 'grid' | 'list';
    refreshInterval: number;
  };
}

export interface User extends BaseEntity {
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  
  // Enhanced fields
  status?: 'active' | 'inactive' | 'suspended';
  lastLoginAt?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  
  // Profile information
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  nationality?: string;
  language?: string; // Default: 'vi'
  timezone?: string; // Default: 'Asia/Ho_Chi_Minh'
  
  // Permissions & Settings
  permissions?: string[];
  preferences?: UserPreferences;
}

export interface AuthResponse {
  user: User;
  tokens: TokenPair;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  phone?: string;
}

// ============== TOUR TYPES ==============

export type TourStatus = 'draft' | 'published' | 'active' | 'completed' | 'cancelled' | 'suspended';

export interface TourPricing {
  tiers: Array<{
    label: string;
    price: number;
  }>;
  currency: string;
}

export interface TourItinerary {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: ('breakfast' | 'lunch' | 'dinner')[];
  accommodation?: string;
}

export interface LocationReference {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export interface Tour extends BaseEntity {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  currentParticipants: number;
  status: TourStatus;
  organizerId: string;
  pricing: TourPricing;
}

export interface CreateTourRequest {
  title: string;
  description: string;
  shortDescription: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  minParticipants: number;
  category: string;
  subCategory?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  pricing: TourPricing;
  currency?: string;
  featuredImage: string;
  gallery?: string[];
  itinerary: TourItinerary[];
  inclusions: string[];
  exclusions: string[];
  requirements?: string[];
  cancellationPolicy: string;
  startLocation: LocationReference;
  endLocation: LocationReference;
  destinations: string[];
  tags: string[];
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface UpdateTourRequest extends Partial<CreateTourRequest> {
  id: string;
}

export type PaginatedTours = PaginatedResponse<Tour>;

// ============== ACTIVITY & SCHEDULE TYPES ==============

export type ActivityType = 'transport' | 'meal' | 'sightseeing' | 'accommodation' | 'free_time' | 'meeting';

export interface Activity extends BaseEntity {
  tourId: string;
  dayNumber: number;
  startTime: string;
  endTime: string;
  locationId: string;
  activityType: ActivityType;
  description: string;
  notes: string;
  estimatedDuration: number; // minutes
  cost?: number;
  capacity?: number;
  requirements?: string[];
}

export interface TourSchedule {
  tourId: string;
  activities: Activity[];
  totalDuration: number; // minutes
  lastUpdated: string;
}

export interface CreateActivityRequest {
  dayNumber: number;
  startTime: string;
  endTime: string;
  locationId: string;
  activityType: ActivityType;
  description: string;
  notes?: string;
  estimatedDuration: number;
  cost?: number;
  capacity?: number;
  requirements?: string[];
}

// ============== PARTICIPANT TYPES ==============

export type ParticipantStatus = 
  | 'registered' 
  | 'confirmed' 
  | 'checked_in' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled' 
  | 'no_show'
  | 'refunded';

export interface Address {
  street: string;
  city: string;
  state?: string;
  country: string;
  postalCode: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
  address?: Address;
}

export interface MedicalInformation {
  allergies: string[];
  medications: string[];
  conditions: string[];
  bloodType?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
}

export interface TravelDocument {
  type: 'passport' | 'visa' | 'id_card' | 'driver_license' | 'insurance';
  number: string;
  issuedDate: string;
  expiryDate: string;
  issuingCountry: string;
  fileUrl?: string;
  verified: boolean;
}

export interface RoomPreference {
  roomType: 'single' | 'double' | 'twin' | 'triple' | 'family';
  smokingPreference: 'smoking' | 'non_smoking' | 'no_preference';
  floorPreference?: 'low' | 'high' | 'no_preference';
  specialRequests?: string;
}

export interface ParticipantProfile {
  fullName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  nationality: string;
  passportNumber?: string;
  phoneNumber: string;
  email: string;
  address: Address;
}

export interface Participant extends BaseEntity {
  tourId: string;
  userId: string;
  
  // Registration Info
  registrationDate: string;
  registrationSource: 'web' | 'mobile' | 'agent' | 'import';
  
  // Personal Information
  profile: ParticipantProfile;
  
  // Status & Progress
  status: ParticipantStatus;
  
  // Special Requirements
  emergencyContact: EmergencyContact;
  medicalInfo: MedicalInformation;
  dietaryRestrictions: string[];
  specialRequirements: string[];
  
  // Accommodation
  roomPreference: RoomPreference;
  
  // Travel Documents
  documents: TravelDocument[];
  
  // Payment & Booking
  bookingReference: string;
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded';
  
  // Audit
  lastActivityAt: string;
}

// ============== LOCATION TYPES ==============

export type LocationType = 
  | 'hotel' 
  | 'restaurant' 
  | 'attraction' 
  | 'transport_hub' 
  | 'meeting_point' 
  | 'activity_center'
  | 'shopping'
  | 'entertainment'
  | 'cultural_site'
  | 'natural_site';

export interface ContactInformation {
  phone?: string;
  email?: string;
  website?: string;
  socialMedia?: Record<string, string>;
}

export interface OperatingHours {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  openTime: string; // HH:mm
  closeTime: string; // HH:mm
  closed: boolean;
  notes?: string;
}

export interface AccessibilityFeatures {
  wheelchairAccessible: boolean;
  elevatorAccess: boolean;
  brailleSignage: boolean;
  audioGuide: boolean;
  signLanguageSupport: boolean;
}

export interface LocationImage {
  url: string;
  caption?: string;
  isPrimary: boolean;
  order: number;
}

export interface Location extends BaseEntity {
  name: string;
  description: string;
  address: string | null;
  latitude: string;
  longitude: string;
  locationType: LocationType;
  category: string | null;
  contactInfo: ContactInformation | null;
  openingHours: OperatingHours[] | null;
  rating: number | null;
  images: string[] | null;
  amenities: string[] | null;
  isVerified: boolean;
}

export type PaginatedLocations = PaginatedResponse<Location>;

// ============== TRANSPORTATION TYPES ==============

export type TransportType = 'bus' | 'van' | 'car' | 'train' | 'boat' | 'plane' | 'walking';
export type VehicleStatus = 'available' | 'in_use' | 'maintenance' | 'out_of_service' | 'retired';

export interface VehicleCapacity {
  passengers: number;
  luggage: number; // cubic meters
  wheelchairAccessible: boolean;
}

export interface VehicleSpecifications {
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  fuelEfficiency: number; // km/l or km/kWh
  transmission: 'manual' | 'automatic';
  airConditioning: boolean;
  wifi: boolean;
  gps: boolean;
}

export interface DriverInformation {
  userId: string;
  fullName: string;
  phoneNumber: string;
  licenseNumber: string;
  licenseExpiry: string;
  experience: number; // years
  rating: number;
  languages: string[];
}

export interface Vehicle extends BaseEntity {
  // Basic Information
  name: string;
  type: TransportType;
  make: string;
  model: string;
  year: number;
  
  // Capacity & Specifications
  capacity: VehicleCapacity;
  specifications: VehicleSpecifications;
  
  // Registration & Legal
  licensePlate: string;
  registrationNumber: string;
  
  // Driver Assignment
  primaryDriver?: DriverInformation;
  secondaryDriver?: DriverInformation;
  
  // Status & Availability
  status: VehicleStatus;
  
  // Features & Amenities
  amenities: string[];
  
  // Tracking & Location
  gpsTracking: boolean;
  currentLocation?: {
    latitude: number;
    longitude: number;
    lastUpdate: string;
  };
  
  // Operating Costs
  dailyRate: number;
  mileageRate: number; // per km
  
  // Maintenance
  nextMaintenanceDate?: string;
  lastMaintenanceDate?: string;
}

// ============== COMMUNICATION TYPES ==============

export type MessageType = 
  | 'text' 
  | 'image' 
  | 'video' 
  | 'audio' 
  | 'file' 
  | 'location' 
  | 'announcement' 
  | 'system'
  | 'poll'
  | 'emergency';

export interface MessageAttachment {
  id: string;
  type: 'image' | 'video' | 'audio' | 'file';
  url: string;
  filename: string;
  size: number; // bytes
  mimeType: string;
}

export interface Message extends BaseEntity {
  chatId: string;
  senderId: string;
  
  // Content
  content: string;
  messageType: MessageType;
  
  // Attachments
  attachments: MessageAttachment[];
  
  // Threading
  replyTo?: string;
  threadId?: string;
  
  // Status & Delivery
  status: 'sent' | 'delivered' | 'read' | 'failed';
  
  // Moderation
  edited: boolean;
  editedAt?: string;
  deleted: boolean;
  deletedAt?: string;
  moderatedBy?: string;
  
  // Metadata
  metadata?: Record<string, string | number | boolean>;
}

export interface SendNotificationRequest {
  target: {
    userIds?: string[];
    roles?: UserRole[];
    tourId?: string;
  };
  title: string;
  body: string;
  data?: Record<string, string | number | boolean>;
  channel: 'push' | 'in_app' | 'email' | 'sms';
  priority: 'low' | 'normal' | 'high' | 'critical';
}

// ============== ATTENDANCE TYPES ==============

export type CheckInMethod = 'qr' | 'gps' | 'manual' | 'nfc' | 'photo' | 'biometric';

export interface GeofenceSettings {
  center: {
    latitude: number;
    longitude: number;
  };
  radius: number; // meters
  strictMode: boolean;
}

export interface AttendanceRecord extends BaseEntity {
  participantId: string;
  activityId: string;
  
  // Check-in Information
  checkInTime: string;
  checkInMethod: CheckInMethod;
  checkInLocation: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  
  // Verification
  verified: boolean;
  verifiedBy?: string;
  
  // Status
  status: 'present' | 'late' | 'absent' | 'excused';
  notes?: string;
  
  // Photo Evidence
  photoUrl?: string;
}

export interface AttendanceCheckInRequest {
  activityId: string;
  method: CheckInMethod;
  gps?: {
    lat: number;
    lng: number;
  };
  photo?: string; // base64 or file reference
}

export interface AttendanceStatusResponse {
  tourId: string;
  activities: Array<{
    activityId: string;
    activityName: string;
    checkedIn: number;
    total: number;
    percentage: number;
  }>;
  overallAttendance: {
    present: number;
    total: number;
    percentage: number;
  };
}

// ============== ANALYTICS TYPES ==============

export interface TourMetrics {
  total: number;
  active: number;
  completed: number;
  cancelled: number;
  draft: number;
  
  // Capacity
  totalCapacity: number;
  bookedCapacity: number;
  utilizationRate: number; // percentage
  
  // Performance
  averageRating: number;
  completionRate: number;
  cancellationRate: number;
  
  // Geographic Distribution
  byDestination: Record<string, number>;
  byCategory: Record<string, number>;
}

export interface ParticipantMetrics {
  total: number;
  new: number;
  returning: number;
  
  // Demographics
  byAge: Record<string, number>;
  byGender: Record<string, number>;
  byNationality: Record<string, number>;
  
  // Engagement
  attendanceRate: number;
  satisfactionScore: number;
  referralRate: number;
}

export interface RevenueMetrics {
  total: number;
  thisMonth: number;
  lastMonth: number;
  growth: number; // percentage
  
  // Breakdown
  byTour: Record<string, number>;
  byCategory: Record<string, number>;
  byMonth: Record<string, number>;
}

export interface SatisfactionMetrics {
  averageRating: number;
  totalReviews: number;
  distribution: Record<string, number>; // 1-5 stars
  
  // Trends
  trend: 'improving' | 'declining' | 'stable';
  changeFromLastPeriod: number;
}

export interface DashboardAnalytics {
  // Time Range
  period: {
    start: string;
    end: string;
    timeZone: string;
  };
  
  // Core KPIs
  tours: TourMetrics;
  participants: ParticipantMetrics;
  revenue: RevenueMetrics;
  satisfaction: SatisfactionMetrics;
  
  // Trends
  trends: {
    tours: Array<{ date: string; value: number }>;
    revenue: Array<{ date: string; value: number }>;
    participants: Array<{ date: string; value: number }>;
    satisfaction: Array<{ date: string; value: number }>;
  };
  
  // Comparisons
  previousPeriod?: Partial<DashboardAnalytics>;
  
  generatedAt: string;
  generatedBy: string;
}

// ============== API REQUEST/RESPONSE HELPERS ==============

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
}

export interface ErrorResponse {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

// Search & Filter Types
export interface SearchParams {
  q?: string; // General search query
  filters?: Record<string, string | number | boolean | string[]>;
  sort?: {
    field: string;
    order: 'asc' | 'desc';
  };
  pagination?: PaginationParams;
}

// ============== API REQUEST/RESPONSE HELPERS ==============
