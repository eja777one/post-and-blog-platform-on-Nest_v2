import { HydratedDocument, Model } from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { add } from "date-fns";

@Schema()
export class PassRecovery {
  @Prop({ required: true })
  userId: string
  @Prop({ required: true })
  passwordRecoveryCode: string
  @Prop({ required: true })
  createdAt: string
  @Prop({ required: true })
  expiredAt: string

  static makePasswordData(userId: string,
    PassRecoveryModel: PassRecoveryModelType) {
    return new PassRecoveryModel({
      userId: userId,
      passwordRecoveryCode: uuidv4(),
      createdAt: new Date().toISOString(),
      expiredAt: add(new Date(), { minutes: 10 }).toISOString(),
    });
  };
};

export const PassRecoverySchema = SchemaFactory.createForClass(PassRecovery);

const PassRecoveryStaticMethods: PassRecoveryModelStaticType = {
  makePasswordData: PassRecovery.makePasswordData,
};

PassRecoverySchema.statics = PassRecoveryStaticMethods;

export type PassRecoveryModelStaticType = {
  makePasswordData: (userId: string, PassRecoveryModel: PassRecoveryModelType)
    => PassRecoveryDocument,
};

export type PassRecoveryDocument = HydratedDocument<PassRecovery>;

export type PassRecoveryModelType = Model<PassRecoveryDocument>
  & PassRecoveryModelStaticType;