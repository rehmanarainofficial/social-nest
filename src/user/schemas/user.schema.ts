import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: true,
    trim: true,
  })
  name!: string;

  @Prop({
    unique: true,
    lowercase: true,
    trim: true,
    sparse: true,
  })
  username!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true, minlength: 6, select: false })
  password!: string;

  @Prop({ default: '', type: String })
  avatar!: string;

  @Prop({ default: '', type: String })
  coverImage!: string;

  @Prop({ default: '', type: String })
  bio!: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  followers!: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  following!: Types.ObjectId[];

  @Prop({ default: false, type: Boolean })
  isEmailVerified!: boolean;

  @Prop({ default: null, type: String })
  emailVerificationOtp!: string | null;

  @Prop({ default: null, type: Date })
  emailVerificationOtpExpires!: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
