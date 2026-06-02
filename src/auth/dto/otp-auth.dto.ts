import { IsEmail, IsString } from "class-validator";

export class OtpVerifyDto {
  @IsEmail()
  email!: string;

  @IsString()
  otp!: string;
}
