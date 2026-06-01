import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Transform(({ value }) => value.trim().toLowerCase())
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password!: string;
}


export class CreateUserData {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Transform(({ value }) => value.trim().toLowerCase())
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password!: string;
  
  @IsString()
  @IsNotEmpty()
  emailVerificationOtp!: string;

  @Type(() => Date)
  @IsDate()
  emailVerificationOtpExpires!: Date;

};