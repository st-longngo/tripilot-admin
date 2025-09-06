// types/forms.ts - Enhanced Form Data Types

import { 
  TourPricing, 
  TourItinerary, 
  LocationReference, 
  LocationType, 
  TransportType,
  Address,
  EmergencyContact,
  MedicalInformation,
  RoomPreference,
  ContactInformation,
  OperatingHours
} from './api';

// ============================================================================
// Authentication Forms
// ============================================================================

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ============================================================================
// Tour Forms

export interface TourFormData {
  // Basic Information
  title: string;
  description: string;
  shortDescription: string;
  
  // Scheduling
  startDate: string;
  endDate: string;
  
  // Participants
  maxParticipants: number;
  minParticipants: number;
  
  // Classification
  category: string;
  subCategory?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  ageRestriction: {
    min?: number;
    max?: number;
  };
  
  // Pricing
  pricing: TourPricing;
  currency: string;
  
  // Content & Media
  featuredImage: string;
  gallery: string[];
  itinerary: TourItinerary[];
  
  // Logistics
  inclusions: string[];
  exclusions: string[];
  requirements: string[];
  cancellationPolicy: string;
  
  // Location & Route
  startLocation: LocationReference;
  endLocation: LocationReference;
  destinations: string[];
  
  // Marketing
  tags: string[];
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface TourQuickCreateFormData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  status?: string; // Optional for create, required for edit
  pricing: {
    currency: string;
    price: number;
  };
  tags: string[];
  schedules: {
    dayNumber: number;
    startTime: string;
    endTime: string;
    locationId: string;
    activityType: string;
    description: string;
    notes: string;
  }[];
}

export interface CreateTourFormData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  category: string;
  basePrice: number;
  startLocation: LocationReference;
  endLocation: LocationReference;
}

export interface TourSearchFormData {
  query?: string;
  category?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  destination?: string;
  priceRange?: [number, number];
  difficulty?: number[];
  tags?: string[];
  organizerId?: string;
}

export interface TourFiltersFormData {
  dateRange?: [string?, string?];
  categories: string[];
  status: string[];
  destinations: string[];
  priceRange: [number, number];
  capacity: [number, number];
  difficulty: number[];
  tags: string[];
  organizerId?: string;
}

// ============== PARTICIPANT FORM TYPES ==============

export interface ParticipantFormData {
  // Personal Information
  fullName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  nationality: string;
  passportNumber?: string;
  phoneNumber: string;
  email: string;
  address: Address;
  
  // Emergency Contact
  emergencyContact: EmergencyContact;
  
  // Medical Information
  medicalInfo: MedicalInformation;
  dietaryRestrictions: string[];
  specialRequirements: string[];
  
  // Travel Preferences
  roomPreference: RoomPreference;
  
  // Communication Preferences
  communicationPreferences: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
    preferredLanguage: string;
  };
  
  // Tour Specific
  tourId: string;
  bookingReference?: string;
  specialRequests?: string;
}

export interface ParticipantRegistrationFormData {
  // Basic Info
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  nationality: string;
  
  // Emergency Contact (simplified)
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  
  // Requirements (simplified)
  dietaryRestrictions: string[];
  medicalConditions: string[];
  specialRequirements: string;
  
  // Room Preference (simplified)
  roomType: 'single' | 'double' | 'twin' | 'triple';
  smokingPreference: 'smoking' | 'non_smoking' | 'no_preference';
  
  // Agreement
  termsAccepted: boolean;
  privacyAccepted: boolean;
  marketingConsent: boolean;
}

export interface ParticipantBulkImportFormData {
  file: File;
  tourId: string;
  skipDuplicates: boolean;
  sendWelcomeEmail: boolean;
  defaultRoomType: string;
  mappingOptions: {
    nameColumn: string;
    emailColumn: string;
    phoneColumn: string;
    dobColumn?: string;
    nationalityColumn?: string;
  };
}

export interface ParticipantSearchFormData {
  query?: string;
  tourId?: string;
  status?: string[];
  nationality?: string[];
  ageRange?: [number, number];
  registrationDateRange?: [string?, string?];
  hasSpecialRequirements?: boolean;
  roomType?: string[];
}

// ============== LOCATION FORM TYPES ==============

export interface LocationFormData {
  // Basic Information
  name: string;
  description: string;
  shortDescription?: string;
  
  // Geographic
  address: Address;
  latitude: number;
  longitude: number;
  timezone: string;
  
  // Classification
  locationType: LocationType;
  category: string;
  subCategory?: string;
  
  // Business Information
  businessInfo?: {
    businessName: string;
    businessType: string;
    website?: string;
    priceRange: 1 | 2 | 3 | 4;
  };
  
  // Features
  amenities: string[];
  accessibility: {
    wheelchairAccessible: boolean;
    elevatorAccess: boolean;
    brailleSignage: boolean;
    audioGuide: boolean;
    signLanguageSupport: boolean;
  };
  
  // Contact & Hours
  contactInfo: {
    phone?: string;
    email?: string;
    website?: string;
  };
  operatingHours: Array<{
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    closed: boolean;
  }>;
  
  // Media
  images: Array<{
    url: string;
    caption?: string;
    isPrimary: boolean;
  }>;
  
  // Pricing & Booking
  pricing?: {
    adult?: number;
    child?: number;
    senior?: number;
    group?: number;
  };
  bookingRequired: boolean;
  capacity?: number;
  
  // Metadata
  tags: string[];
}

export interface LocationSearchFormData {
  query?: string;
  locationType?: LocationType[];
  category?: string[];
  near?: {
    latitude: number;
    longitude: number;
    radius: number;
  };
  amenities?: string[];
  priceRange?: [number, number];
  rating?: [number, number];
  accessibility?: string[];
}

// ============== VEHICLE FORM TYPES ==============

export interface VehicleFormData {
  // Basic Information
  name: string;
  type: TransportType;
  make: string;
  model: string;
  year: number;
  
  // Capacity
  capacity: {
    passengers: number;
    luggage: number;
    wheelchairAccessible: boolean;
  };
  
  // Specifications
  specifications: {
    fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
    fuelEfficiency: number;
    transmission: 'manual' | 'automatic';
    airConditioning: boolean;
    wifi: boolean;
    gps: boolean;
  };
  
  // Registration & Legal
  licensePlate: string;
  registrationNumber: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  insuranceExpiry?: string;
  
  // Driver Information
  primaryDriver?: {
    userId: string;
    fullName: string;
    phoneNumber: string;
    licenseNumber: string;
    licenseExpiry: string;
  };
  
  // Features
  amenities: string[];
  
  // Operating Costs
  dailyRate: number;
  mileageRate: number;
  
  // Maintenance
  nextMaintenanceDate?: string;
  maintenanceNotes?: string;
}

export interface VehicleAssignmentFormData {
  tourId: string;
  assignments: Array<{
    activityId: string;
    vehicleId: string;
    driverId?: string;
    pickupTime?: string;
    pickupLocation?: string;
    dropoffTime?: string;
    dropoffLocation?: string;
    notes?: string;
  }>;
}

export interface VehicleSearchFormData {
  query?: string;
  type?: TransportType[];
  status?: string[];
  capacity?: [number, number];
  availabilityDate?: string;
  location?: string;
  features?: string[];
}

// ============== COMMUNICATION FORM TYPES ==============

export interface MessageFormData {
  content: string;
  messageType: 'text' | 'announcement' | 'emergency';
  attachments?: File[];
  replyTo?: string;
  urgent?: boolean;
}

export interface NotificationFormData {
  title: string;
  body: string;
  target: {
    userIds?: string[];
    roles?: string[];
    tourId?: string;
  };
  channels: ('push' | 'in_app' | 'email' | 'sms')[];
  priority: 'low' | 'normal' | 'high' | 'critical';
  scheduledFor?: string;
  data?: Record<string, string>;
}

export interface AnnouncementFormData {
  title: string;
  content: string;
  target: {
    tourIds?: string[];
    roles?: string[];
    allUsers?: boolean;
  };
  priority: 'low' | 'normal' | 'high';
  publishAt?: string;
  expiresAt?: string;
  attachments?: File[];
}

// ============== ACTIVITY FORM TYPES ==============

export interface ActivityFormData {
  dayNumber: number;
  startTime: string;
  endTime: string;
  locationId: string;
  activityType: 'transport' | 'meal' | 'sightseeing' | 'accommodation' | 'free_time' | 'meeting';
  description: string;
  notes?: string;
  estimatedDuration: number; // in minutes
  cost?: number;
  capacity?: number;
  requirements?: string[];
  includesTransport?: boolean;
  includesMeals?: ('breakfast' | 'lunch' | 'dinner')[];
}

export interface ScheduleFormData {
  tourId: string;
  activities: ActivityFormData[];
  totalDuration: number;
  estimatedCost: number;
}

// ============== ATTENDANCE FORM TYPES ==============

export interface CheckInFormData {
  participantId: string;
  activityId: string;
  method: 'qr' | 'gps' | 'manual' | 'nfc' | 'photo';
  location?: {
    latitude: number;
    longitude: number;
  };
  photo?: File;
  notes?: string;
  verifiedBy?: string;
}

export interface AttendanceSessionFormData {
  tourId: string;
  activityId: string;
  sessionName: string;
  sessionType: 'activity_start' | 'activity_end' | 'meal' | 'accommodation' | 'checkpoint';
  scheduledTime: string;
  location: LocationReference;
  allowedMethods: ('qr' | 'gps' | 'manual' | 'nfc' | 'photo')[];
  geofence?: {
    latitude: number;
    longitude: number;
    radius: number;
    strictMode: boolean;
  };
  settings: {
    autoCloseAfter?: number; // minutes
    requirePhoto?: boolean;
    allowLateCheckIn?: boolean;
    lateThreshold?: number; // minutes
  };
}

// ============== SEARCH & FILTER FORM TYPES ==============

export interface GlobalSearchFormData {
  query: string;
  type?: ('tours' | 'participants' | 'locations' | 'vehicles')[];
  filters?: Record<string, string | number | boolean | string[]>;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AdvancedFilterFormData {
  entity: 'tours' | 'participants' | 'locations' | 'vehicles';
  filters: Record<string, string | number | boolean | string[]>;
  savedFilter?: {
    name: string;
    isPublic: boolean;
  };
}

// ============== USER & AUTH FORM TYPES ==============

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  role: string;
  phone?: string;
  acceptTerms: boolean;
}

export interface UserFormData {
  email: string;
  password?: string;
  fullName: string;
  role: 'customer' | 'tour_guide' | 'tour_operator' | 'admin';
  phone?: string;
  acceptTerms?: boolean;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileFormData {
  fullName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  nationality?: string;
  language: string;
  timezone: string;
  avatarUrl?: string;
  preferences: {
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
  };
}

// ============== FORM VALIDATION TYPES ==============

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: string | number | boolean) => string | undefined;
}

export interface FormFieldValidation {
  [fieldName: string]: ValidationRule[];
}

export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
}

// ============================================================================
// Location Forms
// ============================================================================

export interface CreateLocationFormData {
  name: string;
  description: string;
  locationType: LocationType;
  address?: string;
  category?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  openingHours?: {
    mon_fri?: string;
    sat?: string;
    sun?: string;
  };
  images?: string[];
  amenities?: string[];
}

export interface UpdateLocationFormData extends CreateLocationFormData {
  id: string;
}

// ============== FORM STEP TYPES ==============

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  optional?: boolean;
  validation?: FormFieldValidation;
}

export interface MultiStepFormData {
  currentStep: number;
  steps: FormStep[];
  data: Record<string, string | number | boolean | string[]>;
  completedSteps: string[];
}

// Export common validation patterns
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  passport: /^[A-Z0-9]{6,9}$/,
  postalCode: /^[0-9]{5,6}$/,
  url: /^https?:\/\/.+/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
} as const;
