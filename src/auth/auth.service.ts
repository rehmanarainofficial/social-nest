import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dto/create-auth.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async register(signupDto: SignupDto) {
    let userFind = await this.userService.findByEmail(signupDto.email);
    if (userFind) throw new ConflictException('Email already exists');
    let hashedPassword = await bcrypt.hash(signupDto.password, 12);
    let newUser = this.userService.create({
      ...signupDto,
      password: hashedPassword,
    });
    return newUser;
  }
}
