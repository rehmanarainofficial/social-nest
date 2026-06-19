import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  BadRequestException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostService } from '../services/post.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() req: Request & { user: { userId: string; email: string } },
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const user = req.user;
    return this.postService.create(user.userId, createPostDto, file);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(
    @Param('id') id: string,
    @Req() req: Request & { user: { userId: string; email: string } },
  ) {
    const user = req.user;
    return this.postService.remove(id, user.userId);
  }
}
