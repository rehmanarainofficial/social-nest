import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class LoginDto {

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
