import { Injectable } from '@nestjs/common';
import { SignupDto } from './dto/create-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/schemas/user.schema';
import { Model } from 'mongoose';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(@InjectModel('User') private userModel:Model<User>,
    private userService: UserService) {}
  async create(signupDto: SignupDto) {
    return this.userService.create(signupDto);
  }
}
