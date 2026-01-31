export enum UserRole {
  CUSTOMER = 'customer',
  CONTRACTOR = 'contractor',
  ADMIN = 'admin',
}

export enum VerificationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface User {
  id: string;
  role: UserRole;
  name: string;
  phone: string;
  email: string;
  isVerified: boolean;
  verificationStatus?: VerificationStatus;
  rating: number;
  createdAt: string;
  avatar?: string;
}

export interface Document {
  id: string;
  userId: string;
  type: 'passport' | 'inn' | 'ogrn' | 'license';
  url: string;
  status: VerificationStatus;
  uploadedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}
