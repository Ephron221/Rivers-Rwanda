// Core TypeScript interfaces for the Rivers Rwanda app

export interface User {
  id: string;
  email: string;
  role: 'client' | 'seller' | 'admin' | 'agent';
  status: 'active' | 'pending' | 'suspended' | 'deleted';
  email_verified: boolean;
  created_at: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  profile_image?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Accommodation {
  id: string;
  seller_id: string | null;
  type: 'apartment' | 'hotel_room' | 'event_hall';
  sub_type?: 'whole' | 'room';
  purpose: 'rent' | 'sale' | 'both';
  name: string;
  description: string;
  city: string;
  district: string;
  price_per_night?: number;
  price_per_event?: number;
  sale_price?: number;
  max_guests?: number;
  capacity?: number;
  wifi: boolean;
  parking: boolean;
  garden: boolean;
  decoration: boolean;
  sonolization: boolean;
  gym: boolean;
  kitchen: boolean;
  toilet: boolean;
  living_room: boolean;
  swimming_pool: boolean;
  number_of_living_rooms?: number;
  floor_number?: number;
  room_name_number?: string;
  bed_type?: 'single' | 'double' | 'triple' | 'other';
  has_elevator?: boolean;
  is_furnished?: boolean;
  status: 'pending_approval' | 'available' | 'unavailable' | 'maintenance' | 'rejected';
  images: string | any[];
  amenities: string | any[];
  created_at: string;
}

export interface Vehicle {
  id: string;
  seller_id: string | null;
  make: string;
  model: string;
  year: number;
  vehicle_type: string;
  fuel_type: string;
  transmission: string;
  purpose: 'rent' | 'buy';
  daily_rate?: number;
  sale_price?: number;
  status: string;
  images: string | any[];
  created_at: string;
  color?: string;
  seats?: number;
  mileage?: number;
  description?: string;
}

export interface House {
  id: string;
  seller_id: string | null;
  title: string;
  description: string;
  full_address: string;
  city: string;
  district: string;
  purpose: 'rent' | 'sale' | 'both';
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  status: string;
  images: string | any[];
  features: string | any[];
  created_at: string;
}

export interface Booking {
  id: string;
  booking_type: 'accommodation' | 'vehicle_rent' | 'vehicle_purchase' | 'house_rent' | 'house_purchase';
  booking_reference: string;
  client_id: string;
  seller_id?: string;
  accommodation_id?: string;
  vehicle_id?: string;
  house_id?: string;
  start_date?: string;
  end_date?: string;
  total_amount: number;
  booking_status: 'pending' | 'approved' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';
  payment_status?: 'pending' | 'paid' | 'refunded';
  created_at: string;
  property_name?: string;
  client_name?: string;
  client_phone?: string;
  payment_proof_path?: string;
  accommodation_type?: string;
  accommodation_sub_type?: string;
}

export interface Commission {
  id: string;
  seller_id: string;
  booking_id: string;
  amount: number;
  status: 'approved' | 'paid' | 'completed';
  earned_at: string;
  payout_proof_path?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export interface SellerProduct {
  id: string;
  type: 'accommodation' | 'vehicle' | 'house';
  name?: string;
  title?: string;
  make?: string;
  model?: string;
  status: string;
  price?: number;
  images: string | any[];
  created_at: string;
}

export interface AdminStats {
  totalUsers: number;
  totalSellers: number;
  totalBookings: number;
  totalRevenue: number;
  pendingApprovals: number;
  totalAccommodations: number;
  totalVehicles: number;
  totalHouses: number;
}
