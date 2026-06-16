import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-auth.dto';
import { SignupDto } from './dto/create-auth.dto';
import { OtpVerifyDto } from './dto/otp-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  register(@Body() signupDto: SignupDto) {
    return this.authService.register(signupDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('otp-verify')
  optVerify(@Body() optVerifyDto: OtpVerifyDto) {
    return this.authService.otpVerify(optVerifyDto);
  }
}
