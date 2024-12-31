export interface RegistrationSession {
    phoneNumber: string;
    verificationId: string;
    phoneVerified?: boolean;
    namee?: string;
    dob?: {
      day: number;
      month: string;
      year: number;
    };
    [key: string]: unknown;        
  }
  