import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { Model, Types } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { User, UserDocument } from '../user/schemas/user.schema';

@Injectable()
export class PostService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(
    owner: Types.ObjectId,
    createPostDto: CreatePostDto,
    file: Express.Multer.File,
  ) {
    const upload = await this.cloudinaryService.uploadFile(file);
    const newPost = await this.postModel.create({
      caption: createPostDto.caption,
      image: { url: upload.secure_url, publicId: upload.public_id },
      owner: owner,
    });

    await this.userModel.findByIdAndUpdate(owner, {
      $push: { savedPosts: newPost._id },
    });
    return newPost;
  }

  async findAll() {
    const allPosts: PostDocument[] = await this.postModel
      .find()
      .populate('owner', 'name email ')
      .exec();

    if (!allPosts) {
      throw new NotFoundException('Posts not found');
    }
    return allPosts;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  async remove(postId: string, userId: string) {
    const findPost: PostDocument | null = await this.postModel
      .findById(postId)
      .exec();

    if (!findPost) {
      throw new NotFoundException('Post not found');
    }

    if (findPost.owner.toString() !== userId) {
      throw new BadRequestException(
        'You are not authorized to delete this post',
      );
    }
    await this.cloudinaryService.deleteFile(findPost.image.publicId);
    await this.postModel.findByIdAndDelete(postId).exec();

    await this.userModel.findByIdAndUpdate(userId, {
      $pull: { savedPosts: postId },
    });

    return 'Post deleted successfully';
  }
}
