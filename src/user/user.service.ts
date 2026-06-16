import { SignupTypes } from './types/user.type';
import { BadRequestException, Injectable, Request } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async create(signupTypes: SignupTypes) {
    const newUser = await this.userModel.create(signupTypes);
    return newUser;
  }

  async findAll() {
    const allUsers = await this.userModel.find().select('-password').exec();
    if (!allUsers) {
      throw new BadRequestException('Users not found');
    }
    return allUsers;
  }

  async findProfile(user) {
    const userId = user.userId;
    if (!userId) {
      throw new BadRequestException('Invalid user ID');
    }
    const findProfileUser = this.userModel.findById(userId).select('-password').exec();
    if (!findProfileUser) {
      throw new BadRequestException('User not found');
    }
    return findProfileUser;
  }

  findOne(id: string) {
    if (!id) {
      throw new BadRequestException('Invalid user ID');
    }
    const findOneUser = this.userModel.findById(id).select('-password').exec();
    if (!findOneUser) {
      throw new BadRequestException('User not found');
    }
    return findOneUser;
  }

  remove(id: string) {
    if (!id) {
      throw new BadRequestException('Invalid user ID');
    }
    const deleteUser = this.userModel.findByIdAndDelete(id).select('-password').exec();
    if (!deleteUser) {
      throw new BadRequestException('User not found');
    }
    return deleteUser;
  }
}
