import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'social-nest',
          resource_type: 'auto',
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error) {
            return reject(error);
          } else {
            resolve(result as UploadApiResponse);
          }
        },
      );
      uploadStream.end(file.buffer);
    });
  }
}
