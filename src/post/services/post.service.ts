import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CloudinaryService } from '../../cloudinary/services/cloudinary.service';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../schemas/post.schema';
import { Model, Types } from 'mongoose';
import { CreatePostDto } from '../dto/create-post.dto';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class PostService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async create(
    ownerId: string,
    createPostDto: CreatePostDto,
    file: Express.Multer.File,
  ) {
    const upload = await this.cloudinaryService.uploadFile(file);
    const newPost = await this.postModel.create({
      caption: createPostDto.caption,
      image: { url: upload.secure_url, publicId: upload.public_id },
      owner: new Types.ObjectId(ownerId),
    });

    await this.userService.addSavedPost(ownerId, newPost._id);
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

  async findOne(id: string) {
    const post = await this.postModel
      .findById(id)
      .populate('owner', 'name email')
      .exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async deleteManyByOwner(ownerId: string) {
    const posts = await this.postModel.find({ owner: ownerId }).exec();
    for (const post of posts) {
      if (post.image?.publicId) {
        await this.cloudinaryService.deleteFile(post.image.publicId);
      }
    }
    await this.postModel.deleteMany({ owner: ownerId }).exec();
  }

  async removeLikesForUser(userId: string) {
    await this.postModel
      .updateMany(
        {},
        {
          $pull: {
            likes: new Types.ObjectId(userId),
          },
        },
      )
      .exec();
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

    await this.userService.removeSavedPost(userId, postId);

    return 'Post deleted successfully';
  }
}
