import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dto/create-auth.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login-auth.dto';
import { MailService } from '../mail/mail.service';
import { OtpVerifyDto } from './dto/otp-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) { }
  async register(createUserData: SignupDto) {
    const userFind = await this.userService.findByEmail(createUserData.email);

    if (userFind) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserData.password, 12);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = await this.userService.create({
      ...createUserData,
      password: hashedPassword,
      emailVerificationOtp: otp,
      emailVerificationOtpExpires: new Date(Date.now() + 10 * 60 * 1000),
    });

    await this.mailService.sendEmail(createUserData.email, otp);

    return {
      message: 'Please check your email for verification.',
      user: newUser,
    };
  }
  async login(loginDto: LoginDto) {
    let userFind = await this.userService.findByEmail(loginDto.email);
    if (!userFind) throw new UnauthorizedException('Invalid email');
    let passwordMatch = await bcrypt.compare(loginDto.password, userFind.password);
    if (!passwordMatch) throw new UnauthorizedException('Invalid password');
    let payload = { email: userFind.email, userId: userFind._id.toString() };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }


  async otpVerify(otpVerifyDto: OtpVerifyDto) {
    const userFind = await this.userService.findByEmail(otpVerifyDto.email);

    if (!userFind) {
      throw new UnauthorizedException('Invalid email');
    }

    if (userFind.isEmailVerified) {
      return {
        message: 'Email already verified',
      };
    }

    if (
      !userFind.emailVerificationOtpExpires ||
      userFind.emailVerificationOtpExpires < new Date()
    ) {
      throw new UnauthorizedException('Otp expired');
    }

    if (userFind.emailVerificationOtp !== otpVerifyDto.otp) {
      throw new UnauthorizedException('Invalid otp');
    }

    userFind.emailVerificationOtp = null;
    userFind.emailVerificationOtpExpires = null;
    userFind.isEmailVerified = true;

    await userFind.save();

    await this.mailService.sendVerificationSuccessEmail(userFind.email, userFind.name);

    return {
      message: 'Email verified successfully',
    };
  }
}
