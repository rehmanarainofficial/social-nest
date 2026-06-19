import { SignupTypes } from '../types/user.type';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model, Types } from 'mongoose';
import { PostService } from '../../post/services/post.service';
import { CloudinaryService } from '../../cloudinary/services/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => PostService))
    private readonly postService: PostService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async create(signupTypes: SignupTypes) {
    const newUser = await this.userModel.create(signupTypes);
    return newUser;
  }

  async update(id: string, updateData: Partial<User>) {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async addSavedPost(userId: string, postId: Types.ObjectId) {
    await this.userModel
      .findByIdAndUpdate(userId, {
        $push: { savedPosts: postId },
      })
      .exec();
  }

  async removeSavedPost(userId: string, postId: string) {
    await this.userModel
      .findByIdAndUpdate(userId, {
        $pull: { savedPosts: new Types.ObjectId(postId) },
      })
      .exec();
  }

  async findAll() {
    const allUsers: UserDocument[] = await this.userModel
      .find()
      .select('-password')
      .populate('savedPosts', 'image caption')
      .exec();
    return allUsers;
  }

  async findProfile(user: { userId: string; email: string }) {
    const userId = user?.userId;
    if (!userId) {
      throw new BadRequestException('Invalid user ID');
    }
    const findProfileUser: UserDocument | null = await this.userModel
      .findById(userId)
      .select('-password')
      .exec();
    if (!findProfileUser) {
      throw new NotFoundException('User not found');
    }
    return findProfileUser;
  }

  async findOne(id: string) {
    if (!id) {
      throw new BadRequestException('Invalid user ID');
    }
    const findOneUser: UserDocument | null = await this.userModel
      .findById(id)
      .select('-password')
      .exec();
    if (!findOneUser) {
      throw new NotFoundException('User not found');
    }
    return findOneUser;
  }

  async remove(id: string, userId: string) {
    if (!id) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.userModel.findById(id).select('-password').exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user._id.toString() !== userId || !user.isEmailVerified) {
      throw new BadRequestException(
        'You are not authorized to delete this user',
      );
    }

    await this.postService.deleteManyByOwner(id);
    await this.postService.removeLikesForUser(id);

    await this.userModel.findByIdAndDelete(id).exec();

    return {
      message: 'User and related data deleted successfully',
    };
  }
}
