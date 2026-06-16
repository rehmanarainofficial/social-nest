import { Injectable } from '@nestjs/common';
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
      image: upload.secure_url,
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
      .populate("owner", "name username email ")
      .exec();

    return allPosts;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
