// import { ObjectID } from "bson";
// import { ObjectId } from "mongodb";
import { IsBoolean, IsEmail, IsString, IsUUID, Length, Matches, Validate } from "class-validator";
import { makeErorrMessage } from "../application/make.error.message";
import { Transform, TransformFnParams } from "class-transformer";
import { CheckBlogId } from "../pipes&valid/check.blogId.class.validator";
import { ApiProperty } from "@nestjs/swagger";
import { Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./dom/users.entity";
import { sw_Paginator } from "../types";
import { PostViewModel } from "../posts/posts.types";

export class UserInputModel {
  @ApiProperty({
    description: "User's login",
    nullable: false,
    minLength: 3,
    maxLength: 10,
    example: "eja777one"
  })
  @IsString(makeErorrMessage("login"))
  @Length(3, 10, makeErorrMessage("login"))
  @Transform(({ value }: TransformFnParams) => value?.trim())
    // @Matches(new RegExp("^[a-zA-Z0-9_-]*$"), makeErorrMessage("login"))
  login: string;
  @ApiProperty({
    description: "User's password",
    nullable: false,
    minLength: 6,
    maxLength: 20,
    example: "userPassword"
  })
  @IsString(makeErorrMessage("password"))
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(6, 20, makeErorrMessage("password"))
  password: string;
  @ApiProperty({
    description: "User's email",
    nullable: false,
    example: "eja777one@gmail.com"
  })
  @IsString(makeErorrMessage("email"))
  @IsEmail(undefined, makeErorrMessage("email"))
  email: string;
};

export class RegistrationEmailResending {
  @ApiProperty({
    description: "User's email",
    nullable: false,
    example: "eja777one@gmail.com"
  })
  @IsString(makeErorrMessage("email"))
  @IsEmail(undefined, makeErorrMessage("email"))
  email: string;
};

export class PasswordRecoveryInputModel {
  @ApiProperty({
    description: "User's email",
    nullable: false,
    example: "eja777one@gmail.com"
  })
  @IsString(makeErorrMessage("email"))
  @IsEmail(undefined, makeErorrMessage("email"))
  email: string;
};

export class RegistrationConfirmationCodeModel {
  @ApiProperty({
    description: "Confirm code, which was sent to user",
    nullable: false,
    example: "b582d22c-aa63-4b67-be2f-bb7f3c2472c2"
  })
  @IsUUID(4, makeErorrMessage("code"))
  code: string;
};

export class LoginInputModel {
  @ApiProperty({
    description: "User's email OR password",
    nullable: false,
    example: "eja777one@gmail.com"
  })
  @IsString(makeErorrMessage("loginOrEmail"))
  loginOrEmail: string;
  @ApiProperty({
    description: "User's password",
    nullable: false,
    minLength: 6,
    maxLength: 20,
    example: "userPassword"
  })
  @IsString(makeErorrMessage("password"))
  password: string;
};

export class NewPasswordRecoveryInputModel {
  @ApiProperty({
    description: "User's password",
    nullable: false,
    minLength: 6,
    maxLength: 20,
    example: "newUserPassword"
  })
  @IsString(makeErorrMessage("newPassword"))
  newPassword: string;
  @ApiProperty({
    description: "User's confirmation",
    nullable: false,
    example: "96140867-9c2e-47c3-a6ee-33ab3ad8b456"
  })
  @IsString(makeErorrMessage("recoveryCode"))
  recoveryCode: string;
};

export class BanUserInputModel {
  @ApiProperty({
    description: "True - if ban user, else false",
    nullable: false,
    example: true
  })
  @IsBoolean(makeErorrMessage("isBanned"))
  isBanned: boolean;
  @ApiProperty({
    description: "Ban reason",
    nullable: false,
    minLength: 20,
    example: "ban-reason-ban-reason-ban-reason-ban-reason"
  })
  @IsString(makeErorrMessage("banReason"))
  @Length(20)
  banReason: string;
};

export class BloggerBanUserInputModel {
  @ApiProperty({
    description: "True - if ban user, else false",
    nullable: false,
    example: true
  })
  @IsBoolean(makeErorrMessage("isBanned"))
  isBanned: boolean;
  @ApiProperty({
    description: "Ban reason",
    nullable: false,
    minLength: 20,
    example: "ban-reason-ban-reason-ban-reason-ban-reason"
  })
  @IsString(makeErorrMessage("banReason"))
  @Length(20)
  banReason: string;
  @ApiProperty({
    description: "Blog's id",
    nullable: false,
    example: "96140867-9c2e-47c3-a6ee-33ab3ad8b456"
  })
  @IsUUID("4", makeErorrMessage("blogId"))
  @Validate(CheckBlogId, makeErorrMessage("blogId"))
  blogId: string;
};

export type BlogsBanInfo = {
  isBanned: boolean
  banReason: string
  blogId: string
  banDate: string
};

export type UserViewModel = {
  id: string
  login: string
  email: string
  createdAt: string
};

class BanInfo {
  @ApiProperty({
    nullable: false,
    example: true
  })
  isBanned: boolean;
  @ApiProperty({
    nullable: false,
    example: "2023-05-16T12:40:55.662Z"
  })
  banDate: string;
  @ApiProperty({
    nullable: false,
    example: "ban-reason-ban-reason-ban-reason-ban-reason"
  })
  banReason: string;
};

export class SAUserViewModel {
  @ApiProperty({
    description: "User's id",
    nullable: false,
    example: "e5713a0d-8d9f-4716-864b-5015daf2df07"
  })
  id: string;
  @ApiProperty({
    description: "User's login",
    nullable: false,
    example: "eja777one"
  })
  login: string;
  @ApiProperty({
    description: "User's email",
    nullable: false,
    example: "eja777one@gmail.com"
  })
  email: string;
  @ApiProperty({
    description: "User's created at date",
    nullable: false,
    example: "2023-05-16T12:40:55.662Z"
  })
  createdAt: string;
  @ApiProperty({
    description: "User's ban info",
    nullable: false
  })
  banInfo: BanInfo;
};

export class UserDTO {
  constructor(
    public login: string,
    public email: string,
    public passwordHash: string,
    public passwordSalt: string,
    public ip: string
  ) {
  }
};

export class UserDBModel {
  constructor(
    // public _id: ObjectID,
    public accountData: {
      login: string,
      email: string,
      passwordHash: string,
      passwordSalt: string,
      createdAt: string
    },
    public emailConfirmation: {
      confirmationCode: string,
      expirationDate: Date,
      isConfirmed: boolean,
      sentEmails: SentEmailType[]
    },
    public registrationDataType: {
      ip: string
    }
  ) {
  }
};

export class MeViewModel {
  @ApiProperty({ nullable: false, example: "eja777one@gmail.com" })
  email: string;
  @ApiProperty({ nullable: false, example: "eja777one" })
  login: string;
  @ApiProperty({
    nullable: false,
    example: "c966e677-4552-4fb3-8027-50200d4b6c2d"
  })
  userId: string;

  constructor(email: string, login: string, userId: string) {
    this.email = email;
    this.login = login;
    this.userId = userId;
  }
};

export class TokensDTO {
  constructor(
    public accessToken: string,
    public refreshToken: string
  ) {
  }
};

export type SentEmailType = {
  sentDate: Date
};

export type UsersRequestDBModel = {
  // _id: ObjectId
  ip: string
  url: string
  createdAt: Date
};

export class BloggerUserViewModel {
  @ApiProperty({
    description: "User's id",
    nullable: false,
    example: "e5713a0d-8d9f-4716-864b-5015daf2df07"
  })
  id: string;
  @ApiProperty({
    description: "User's login",
    nullable: false,
    example: "eja777one"
  })
  login: string;
  @ApiProperty({
    description: "User's ban info",
    nullable: false,
    type: BanInfo
  })
  banInfo: BanInfo;
};

export class UserTestViewModel {
  @ApiProperty({
    description: "User's id",
    nullable: false,
    example: "e5713a0d-8d9f-4716-864b-5015daf2df07"
  })
  id: string;
  @ApiProperty({
    description: "User's login",
    nullable: false,
    example: "eja777one"
  })
  login: string;
  @ApiProperty({
    description: "User's email",
    nullable: false,
    example: "eja777one@gmail.com"
  })
  email: string;
  @ApiProperty({
    description: "User's created at date",
    nullable: false,
    example: "2023-05-16T12:40:55.662Z"
  })
  createdAt: string;
  @ApiProperty({
    description: "User's confirmation",
    nullable: false,
    example: "088a68e7-3e3f-46d8-8c8f-7c87f9b9341d"
  })
  confirmationCode: string;
  @ApiProperty({
    description: "User's confirmation expiration date",
    nullable: false,
    example: "2023-05-16T12:40:55.662Z"
  })
  expirationDate: string;
  @ApiProperty({
    description: "User's confirmation status",
    nullable: false,
    example: true
  })
  isConfirmed: boolean;
  @ApiProperty({
    description: "User's confirmation mails count",
    nullable: false,
    example: 3
  })
  sentEmailsCount: number;
};

export class PassRecTestViewModel {
  @ApiProperty({
    description: "RecCode's id",
    nullable: false,
    example: "e5713a0d-8d9f-4716-864b-5015daf2df07"
  })
  id: string;
  @ApiProperty({
    description: "User's id",
    nullable: false,
    example: "49a71dc8-a8b0-416f-8154-cadd4302fc2e"
  })
  userId: string;
  @ApiProperty({
    description: "RecCode's code",
    nullable: false,
    example: "07a34d92-69e8-49d3-b29c-caaf1911ea21"
  })
  passwordRecoveryCode: string;
  @ApiProperty({
    description: "RecCode's created at date",
    nullable: false,
    example: "2023-05-14T17:00:08.317Z"
  })
  createdAt: string;
  @ApiProperty({
    description: "RecCode's expired at date",
    nullable: false,
    example: "2023-05-14T17:00:08.317Z"
  })
  expiredAt: string;
};

export class sw_Paginator_SAUserViewModel extends sw_Paginator {
  @ApiProperty({
    description: "Items",
    nullable: false,
    isArray: true,
    type: SAUserViewModel
  })
  @ApiProperty()
  items: SAUserViewModel[];
}

export class sw_Paginator_BloggerUserViewModel extends sw_Paginator {
  @ApiProperty({
    description: "Items",
    nullable: false,
    isArray: true,
    type: BloggerUserViewModel
  })
  @ApiProperty()
  items: BloggerUserViewModel[];
}