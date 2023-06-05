import { HydratedDocument, Model } from "mongoose";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { add } from "date-fns";
import { SessionDTO } from "../security.types";

@Schema()
export class Security {
  @Prop({ required: true })
  createdAt: string;

  @Prop({ required: true })
  expiredAt: string;

  @Prop({ required: true })
  deviceId: string;

  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  deviceName: string;

  @Prop({ required: true })
  userId: string;

  static makeSession(sessionDTO: SessionDTO, SecurityModel: SecurityModelType) {
    return new SecurityModel({
      createdAt: sessionDTO.createdAt,
      expiredAt: add(new Date(), { minutes: 60 }).toISOString(),
      deviceId: sessionDTO.deviceId,
      ip: sessionDTO.ip,
      deviceName: sessionDTO.deviceName,
      userId: sessionDTO.userId
    });
  };

  updateSession(createdAt: string) {
    this.createdAt = createdAt;
    this.expiredAt = add(new Date(), { minutes: 60 }).toISOString();
  };
};

export const SecuritySchema = SchemaFactory.createForClass(Security);

SecuritySchema.methods = {
  updateSession: Security.prototype.updateSession,
};

const securityStaticMethods: SecurityModelStaticType = {
  makeSession: Security.makeSession
};

SecuritySchema.statics = securityStaticMethods;

export type SecurityModelStaticType = {
  makeSession: (sessionDTO: SessionDTO, SecurityModel: SecurityModelType)
    => SecurityDocument
};

export type SecurityDocument = HydratedDocument<Security>;

export type SecurityModelType = Model<SecurityDocument>
  & SecurityModelStaticType;