export type SignupTypes = {
  name: string;
  email: string;
  password: string;
  emailVerificationOtp?: string;
  emailVerificationOtpExpires?: Date;
};
