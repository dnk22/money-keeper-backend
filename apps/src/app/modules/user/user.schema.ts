import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({isRequired : true})
  name: string;

  @Prop()
  dateOfBirth: Date;

  @Prop()
  address: string;

  @Prop()
  gender: string;

  @Prop()
  occupation: string;

  @Prop({isRequired : true})
  username: string;

  @Prop({isRequired : true})
  password: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop({default : false})
  is_premium: boolean;

  @Prop()
  createdDate: string;

  @Prop()
  updatedDate: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
