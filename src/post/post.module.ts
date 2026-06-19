import { Module, forwardRef } from '@nestjs/common';
import { PostService } from './services/post.service';
import { PostController } from './controllers/post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schemas/post.schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    forwardRef(() => UserModule),
    CloudinaryModule,
  ],
  controllers: [PostController],
  providers: [PostService, AuthGuard],
  exports: [PostService],
})
export class PostModule {}
