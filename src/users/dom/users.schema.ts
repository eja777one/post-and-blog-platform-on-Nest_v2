import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { BanUserInputModel, BloggerBanUserInputModel, BlogsBanInfo, SentEmailType, UserDTO } from "../users.types";
import { add } from "date-fns";

@Schema({ _id: false })
class AccountData {
  @Prop({ required: true })
  login: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  passwordHash: string;
  @Prop({ required: true })
  passwordSalt: string;
  @Prop({ required: true })
  createdAt: string;
};

@Schema({ _id: false })
class EmailConfirmation {
  @Prop({ required: true })
  confirmationCode: string;
  @Prop({ required: true })
  expirationDate: Date;
  @Prop({ required: true })
  isConfirmed: boolean;
  @Prop({ required: true })
  sentEmails: SentEmailType[];
};

@Schema({ _id: false })
class RegistrationDataType {
  @Prop({ required: true })
  ip: string;
};

@Schema({ _id: false })
class BanInfo {
  @Prop({ required: true })
  isBanned: boolean;
  @Prop()
  banDate: string | null;
  @Prop()
  banReason: string | null;
}

@Schema()
export class User {
  @Prop({ required: true, type: AccountData })
  accountData: AccountData;
  @Prop({ required: true, type: EmailConfirmation })
  emailConfirmation: EmailConfirmation;
  @Prop({ required: true, type: RegistrationDataType })
  registrationDataType: RegistrationDataType;
  @Prop({ required: true, type: BanInfo })
  banInfo: BanInfo;
  @Prop({ required: true, default: [] })
  blogsBanInfo: BlogsBanInfo[];

  static makeUserByAdmin(userDTO: UserDTO, UserModel: UserModelType) {
    const newUser = new UserModel({
      accountData: {
        login: userDTO.login,
        email: userDTO.email,
        passwordHash: userDTO.passwordHash,
        passwordSalt: userDTO.passwordSalt,
        createdAt: new Date().toISOString()
      },
      registrationDataType: {
        ip: userDTO.ip
      },
      emailConfirmation: {
        confirmationCode: "none",
        expirationDate: new Date(),
        isConfirmed: true,
        sentEmails: []
      },
      banInfo: {
        isBanned: false,
        banDate: null,
        banReason: null
      }
    });
    return newUser;
  };

  static makeUser(userDTO: UserDTO, UserModel: UserModelType) {
    const newUser = new UserModel({
      accountData: {
        login: userDTO.login,
        email: userDTO.email,
        passwordHash: userDTO.passwordHash,
        passwordSalt: userDTO.passwordSalt,
        createdAt: new Date().toISOString()
      },
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), { hours: 24 }),
        isConfirmed: false,
        sentEmails: [{ sentDate: new Date() }]
      },
      registrationDataType: { ip: userDTO.ip },
      banInfo: {
        isBanned: false,
        banDate: null,
        banReason: null
      }
    });
    return newUser;
  };

  setBanStatus(banInfoInput: BanUserInputModel) {
    this.banInfo.isBanned = banInfoInput.isBanned;
    if (banInfoInput.isBanned === false) {
      this.banInfo.banReason = null;
      this.banInfo.banDate = null;
    } else {
      this.banInfo.banReason = banInfoInput.banReason;
      this.banInfo.banDate = new Date().toISOString();
    }
  };

  setBanStatusByBlogger(banInfoInput: BloggerBanUserInputModel) {
    const banInfo = this.blogsBanInfo
      .find((el: any) => el.blogId === banInfoInput.blogId);

    if (banInfo?.isBanned === banInfoInput.isBanned) return null;

    if (!banInfo) {
      this.blogsBanInfo.push({
        isBanned: banInfoInput.isBanned,
        banReason: banInfoInput.banReason,
        blogId: banInfoInput.blogId,
        banDate: new Date().toISOString()
      });
    } else {
      for (let el of this.blogsBanInfo) {
        if (el.blogId === banInfoInput.blogId) {
          el.isBanned = banInfoInput.isBanned;
          el.banReason = banInfoInput.banReason;
          el.blogId = banInfoInput.blogId;
          el.banDate = new Date().toISOString();
        }
      }
    }

    return true;
  };

  updateConfirmation(newConfirmationCode: string) {
    this.emailConfirmation.confirmationCode = newConfirmationCode;
    this.emailConfirmation.expirationDate = add(new Date(), { hours: 24 });
    this.emailConfirmation.sentEmails.push({ sentDate: new Date() });
  };

  activateUser() {
    this.emailConfirmation.isConfirmed = true;
  };

  updatePassword(passwordHash: string, passwordSalt: string) {
    this.accountData.passwordHash = passwordHash;
    this.accountData.passwordSalt = passwordSalt;
  };
};

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods = {
  updateConfirmation: User.prototype.updateConfirmation,
  activateUser: User.prototype.activateUser,
  updatePassword: User.prototype.updatePassword,
  setBanStatus: User.prototype.setBanStatus,
  setBanStatusByBlogger: User.prototype.setBanStatusByBlogger
};

const userStaticMethods: UserModelStaticType = {
  makeUserByAdmin: User.makeUserByAdmin,
  makeUser: User.makeUser
};

UserSchema.statics = userStaticMethods;

export type UserModelStaticType = {
  makeUserByAdmin: (userDTO: UserDTO, UserModel: UserModelType) => UserDocument,
  makeUser: (userDTO: UserDTO, UserModel: UserModelType) => UserDocument
};

export type UserDocument = HydratedDocument<User>;

export type UserModelType = Model<UserDocument> & UserModelStaticType;