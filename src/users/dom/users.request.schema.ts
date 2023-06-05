import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

@Schema()
export class UsersRequest {
  @Prop({ required: true })
  ip: string
  @Prop({ required: true })
  url: string
  @Prop({ required: true })
  createdAt: Date
}

export const UsersRequestSchema = SchemaFactory.createForClass(UsersRequest);

export type UsersRequestDocument = HydratedDocument<UsersRequest>;

export type UsersRequestModelType = Model<UsersRequestDocument>;