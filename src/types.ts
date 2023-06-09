import { makeErorrMessage } from "./application/make.error.message";
import { IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { BlogViewModel } from "./blogs/blogs.types";

export const URL = "hometask_30/api";

export class FieldError {
  @ApiProperty({
    description: "Message with error",
    nullable: true,
    example: "Incorrect email"
  })
  public message: string | null;
  @ApiProperty({
    description: "Field with error",
    nullable: true,
    example: "email"
  })
  public field: string | null;

  constructor(field: string) {
    this.message = `incorrect ${field}`;
    this.field = field;
  }
};

export class APIErrorResult {
  @ApiProperty({ nullable: true, type: FieldError })
  errorsMessages: Array<FieldError>;

  constructor(errorsMessages: Array<FieldError>) {
    this.errorsMessages = errorsMessages;
  };
};

export type JWTPayload = {
  userId: string,
  deviceId: string,
  createdAt: string
}

export class BLLResponse<T> {
  constructor(
    public statusCode: HTTP,
    public data?: T | undefined,
    public message?: string | undefined,
    public error?: APIErrorResult | undefined
  ) {
  }
};

export class Paginator<T> {
  @ApiProperty({
    description: "Pages count",
    nullable: false,
    example: 1
  })
  pagesCount: number;
  @ApiProperty({
    description: "Page number",
    nullable: false,
    example: 1
  })
  page: number;
  @ApiProperty({
    description: "Page size",
    nullable: false,
    example: 1
  })
  pageSize: number;
  @ApiProperty({
    description: "Total count",
    nullable: false,
    example: 1
  })
  totalCount: number;
  @ApiProperty({
    description: "Items",
    nullable: false,
    isArray: true
    // type: T
  })
  items: Array<T>;
};

export type LikeStatus = "None" | "Like" | "Dislike"
export const LikeStatuses: LikeStatus[] = ["None", "Like", "Dislike"];

export class LikeInputModel {
  @ApiProperty({
    description: "LikeStatus (Like, Dislike, None)",
    nullable: false,
    example: "Like"
  })
  @IsEnum(LikeStatuses, makeErorrMessage("likeStatus"))
  likeStatus: LikeStatus;
};

export class LikeDetailsViewModel {
  @ApiProperty({
    description: "Like's added date",
    nullable: false,
    example: "2023-05-14T17:30:29.279Z"
  })
  addedAt: string;
  @ApiProperty({
    description: "Like's owner id",
    nullable: false,
    example: "ffe00bba-ac51-4530-8a7b-2f42165ba3b9"
  })
  userId: string;
  @ApiProperty({
    description: "Like's owner login",
    nullable: false,
    example: "Blogger #1"
  })
  login: string;
};

export type LikeDetailsViewModelArr = LikeDetailsViewModel[]

export type LikeDetailsDBModel = {
  addedAt: string,
  userId: string,
  login: string,
  likeStatus: LikeStatus,
  isBanned: boolean
};

export enum sortDirection {
  "ASC" = "ASC",
  "DESC" = "DESC"
};

export enum HTTP {
  "OK_200" = 200,
  "CREATED_201" = 201,
  "NO_CONTENT_204" = 204,
  "BAD_REQUEST_400" = 400,
  "UNAUTHORIZED_401" = 401,
  "FORBIDDEN_403" = 403,
  "NOT_FOUND_404" = 404,
  "METHOD_NOT_ALLOWED_405" = 405,
  "TOO_MANY_REQUESTS_429" = 429
};

export type QueryType = {
  pageNumber: number
  pageSize: number
  sortBy?: string
  sortDirection?: sortDirection
  searchNameTerm?: string
  searchLoginTerm?: string
  searchEmailTerm?: string
  publishedStatus?: string
  bodySearchTerm?: string
  banStatus?: BanStatus
  sort?: string | string[]
};

export type BanStatus = "all" | "banned" | "notBanned";

export type LikeType = "None" | "Like" | "Dislike";

export class LikesInfoViewModel {
  @ApiProperty({
    description: "Likes count",
    nullable: false,
    example: 0
  })
  likesCount: number;
  @ApiProperty({
    description: "Dislikes count",
    nullable: false,
    example: 0
  })
  dislikesCount: number;
  @ApiProperty({
    description: "My like status",
    nullable: false,
    example: "None"
  })
  myStatus: LikeType;
};

export type UsersLikeStatus = {
  userId: string,
  likeStatus: LikeType
  isBanned: boolean
};

export class LoginSuccessViewModel {
  @ApiProperty({
    description: "Access token",
    nullable: false,
    example: "5394ce36-960c-4b6a-97b1-9ce929aa29a4"
  })
  accessToken: string;
};

export class PasswordDataDBModel {
  constructor(
    // public _id: ObjectID,
    // public userId: ObjectID,
    public passwordRecoveryCode: string,
    public createdAt: string,
    public expiredAt: string
  ) {
  }
};

export type QueryInput = {
  pageNumber?: number
  pageSize?: number
  sortBy?: string
  sortDirection?: sortDirection.ASC | sortDirection.DESC
  searchNameTerm?: string,
  searchLoginTerm?: string,
  searchEmailTerm?: string
};

export class sw_Paginator {
  @ApiProperty({
    description: "Pages count",
    nullable: false,
    example: 1
  })
  pagesCount: number;
  @ApiProperty({
    description: "Page number",
    nullable: false,
    example: 1
  })
  page: number;
  @ApiProperty({
    description: "Page size",
    nullable: false,
    example: 1
  })
  pageSize: number;
  @ApiProperty({
    description: "Total count",
    nullable: false,
    example: 1
  })
  totalCount: number;
};

export class GetMyTgAuthViewModel {
  @ApiProperty({
    description: "Link to tg bot with code as query param",
    nullable: false,
    example: "https://t.me/blogger_platform_bot?code=123"
  })
  link: string
}