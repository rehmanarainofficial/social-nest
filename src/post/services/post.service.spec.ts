import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { getModelToken } from '@nestjs/mongoose';
import { Post } from '../schemas/post.schema';
import { UserService } from '../../user/services/user.service';
import { CloudinaryService } from '../../cloudinary/services/cloudinary.service';

describe('PostService', () => {
  let service: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getModelToken(Post.name),
          useValue: {},
        },
        {
          provide: UserService,
          useValue: {
            addSavedPost: jest.fn(),
            removeSavedPost: jest.fn(),
          },
        },
        {
          provide: CloudinaryService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
