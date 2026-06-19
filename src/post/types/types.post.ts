import { Types } from 'mongoose';

export type CreatePostTypes = {
  caption: string;
  image: string;
  owner: Types.ObjectId;
};
