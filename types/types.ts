
export type BookingStatus = 'pending' | 'confirmed' | 'collected' | 'processing' | 'completed';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
}

export interface LabTest {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  turnaroundTime: string;
  preparation?: string;
}

export interface HealthPackage {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  testsCount: number;
  testList: string[];
  recommendedFor: string;
  isPopular?: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  patientName: string;
  patientAge: string;
  patientGender: string;
  tests: LabTest[];
  date: string;
  slot: string;
  address: string;
  total: number;
  status: BookingStatus;
  createdAt: string;
  reportUrl?: string;
}

export interface RecommendationResponse {
  recommendedTests: string[];
  reasoning: string;
  disclaimer: string;
}
