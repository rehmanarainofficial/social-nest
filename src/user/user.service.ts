import { SignupTypes } from './types/user.type';
import { Injectable, Request } from '@nestjs/common';
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

  findAll() {
    return this.userModel.find().exec();
  }

  findProfile(user) {
    const userId = user.userId;
    return this.userModel.findById(userId).exec();
  }

  findOne(id: string) {
    return this.userModel.findById(id).exec();
  }

  remove(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
