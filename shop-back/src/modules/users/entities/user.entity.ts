import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  profilePic: string;

  @Prop({ required: false,default:false })
  verified: boolean;

  @Prop({ required: false,default:false })
  reset: boolean;

  @Prop({ required: false,default:false })
  socialLogin: boolean;

  @Prop({ required: true, enum: [UserRole.ADMIN, UserRole.USER ],default:UserRole.USER})
  role: UserRole;

  _doc?:any;
}



export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<User>('save', async function (next: Function) {  
  const user = this;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password, salt);
  user.password = hashedPassword;
  next();
});