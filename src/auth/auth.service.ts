import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserData, SignupDto } from './dto/create-auth.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login-auth.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) { }
  async register(createUserData: CreateUserData) {
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
      message: 'User registered successfully. Please verify your email.',
      user: newUser,
    };
  }
  async login(loginDto: LoginDto) {
    let userFind = await this.userService.findByEmail(loginDto.email);
    if (!userFind) throw new UnauthorizedException('Invalid email');
    let passwordMatch = await bcrypt.compare(loginDto.password, userFind.password);
    if (!passwordMatch) throw new UnauthorizedException('Invalid password');
    let payload = { email: userFind.email, sub: userFind.id };
    return {
      access_token: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET, expiresIn: '1d' }),
    };
  }
}
