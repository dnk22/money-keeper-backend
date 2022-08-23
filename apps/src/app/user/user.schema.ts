import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  _id: string;

  @Prop({ isRequired: true })
  name: string;

  @Prop({ isRequired: true })
  email: string;

  @Prop({ select: false })
  password: string;

  @Prop()
  dateOfBirth: Date;

  @Prop()
  address: string;

  @Prop()
  gender: string;

  @Prop()
  occupation: string;

  @Prop()
  phone: string;

  @Prop({ default: false })
  is_premium: boolean;

  @Prop()
  createdDate: Date;

  @Prop()
  updatedDate: Date;

  constructor(data: Partial<User> = {}) {
    Object.assign(this, data);
  }

  async checkPassword(plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};
