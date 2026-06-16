import { SignupTypes } from './types/user.type';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../post/schemas/post.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async create(signupTypes: SignupTypes) {
    const newUser = await this.userModel.create(signupTypes);
    return newUser;
  }

  async findAll() {
    const allUsers: UserDocument[] = await this.userModel
      .find()
      .select('-password')
      .populate('savedPosts', 'image caption')
      .exec();
    if (!allUsers) {
      throw new BadRequestException('Users not found');
    }
    return allUsers;
  }

  async findProfile(user) {
    const userId = user?.userId;
    if (!userId) {
      throw new BadRequestException('Invalid user ID');
    }
    const findProfileUser: UserDocument | null = await this.userModel
      .findById(userId)
      .select('-password')
      .exec();
    if (!findProfileUser) {
      throw new BadRequestException('User not found');
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
      throw new BadRequestException('User not found');
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
      throw new BadRequestException('You are not authorized to delete this post');
    }

    const posts = await this.postModel.find({ owner: id }).exec();

    for (const post of posts) {
      if (post.image?.publicId) {
        await this.cloudinaryService.deleteFile(post.image.publicId);
      }
    }

    await this.postModel.deleteMany({ owner: id });

    await this.postModel.updateMany(
      {},
      {
        $pull: {
          likes: id,
        },
      },
    );

    await this.userModel.findByIdAndDelete(id);

    return {
      message: 'User and related data deleted successfully',
    };
  }
}
