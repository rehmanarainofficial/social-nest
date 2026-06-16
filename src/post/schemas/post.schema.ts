import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  caption!: string;
  @Prop({
    required: true,
    type: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
  })
  image!: {
    url: string;
    publicId: string;
  };
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner!: Types.ObjectId;
  @Prop({ default: [], type: [{ type: Types.ObjectId, ref: 'User' }] })
  likes!: Types.ObjectId[];
  @Prop({ default: [], type: [{ type: Types.ObjectId, ref: 'Comment' }] })
  comments!: Types.ObjectId[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
export type PostDocument = HydratedDocument<Post>;
