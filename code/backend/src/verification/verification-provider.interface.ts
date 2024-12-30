export interface IVerificationProvider {
    sendVerification(phoneNumber: string): Promise<string>;
    validateVerification(verificationId: string, code: string): Promise<boolean>;
}