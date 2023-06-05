import { IsString, Length } from "class-validator";
import { makeErorrMessage } from "../application/make.error.message";
import { LikeStatus, sw_Paginator } from "../types";
import { Transform, TransformFnParams } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { PostImagesViewModel, SuperAdminBlogViewModel } from "../blogs/blogs.types";

export class PostInputModelNoId {
  @ApiProperty({
    description: "Post's title",
    nullable: false,
    minLength: 1,
    maxLength: 30,
    example: "Post #1"
  })
  @IsString(makeErorrMessage("title"))
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 30, makeErorrMessage("title"))
  title: string;
  @ApiProperty({
    description: "Post's shortDescription",
    nullable: false,
    minLength: 1,
    maxLength: 100,
    example: "Post #1 for Blog #1"
  })
  @IsString(makeErorrMessage("shortDescription"))
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 100, makeErorrMessage("shortDescription"))
  shortDescription: string;
  @ApiProperty({
    description: "Post's content",
    nullable: false,
    minLength: 1,
    maxLength: 1000,
    example: "I waste a lot of time to write this Post #1 for Blog #1." +
      " So it is perfect!"
  })
  @IsString(makeErorrMessage("content"))
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 1000, makeErorrMessage("content"))
  content: string;
};

export class PostDTO {
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string
  ) {
  }
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

export class ExtendedLikesInfoViewModel {
  @ApiProperty({
    description: "Post's likesCount",
    nullable: false,
    example: 0
  })
  likesCount: number;
  @ApiProperty({
    description: "Post's dislikesCount",
    nullable: false,
    example: 0
  })
  dislikesCount: number;
  @ApiProperty({
    description: "Post's likeStatus for current user",
    nullable: false,
    example: "Like"
  })
  myStatus: LikeStatus;
  @ApiProperty({
    description: "Post's newestLikes",
    nullable: true,
    isArray: true,
    type: LikeDetailsViewModel
  })
  newestLikes: LikeDetailsViewModel[];
};

export class PostViewModel {
  @ApiProperty({
    description: "Post's id",
    nullable: false,
    example: "8918e471-f05d-457f-932c-e7cc2e9c7d42"
  })
  id: string;
  @ApiProperty({
    description: "Post's title",
    nullable: false,
    example: "My Post #1"
  })
  title: string;
  @ApiProperty({
    description: "Post's shortDescription",
    nullable: false,
    example: "My Post #1 for Blog #1"
  })
  shortDescription: string;
  @ApiProperty({
    description: "Post's content",
    nullable: false,
    example: "I waste a lot of time to write this Post #1 for Blog #1." +
      " So it is perfect!"
  })
  content: string;
  @ApiProperty({
    description: "Blog's id",
    nullable: false,
    example: "96140867-9c2e-47c3-a6ee-33ab3ad8b456"
  })
  blogId: string;
  @ApiProperty({
    description: "Blog's name",
    nullable: false,
    example: "Blog #1"
  })
  blogName: string;
  @ApiProperty({
    description: "Post's created date",
    nullable: false,
    example: "2023-05-14T17:00:08.317Z"
  })
  createdAt: string;
  @ApiProperty({
    description: "Post's likes info",
    nullable: false
  })
  extendedLikesInfo: ExtendedLikesInfoViewModel;
  @ApiProperty({
    description: "Post's images info",
    nullable: false
  })
  images: PostImagesViewModel;
};

export class PostDBModel {
  constructor(
    // public _id: ObjectID,
    public userId: string,
    public isHide: boolean,
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string,
    public createdAt: string,
    public likesCount: number,
    public dislikesCount: number,
    public usersLikeStatus: LikeDetailsDBModel[]
  ) {
  }
};

export type LikeDetailsDBModel = {
  addedAt: string,
  userId: string,
  login: string,
  likeStatus: LikeStatus,
  isBanned: boolean
};

export class PostInfo {
  @ApiProperty({
    description: "Post's id",
    nullable: false,
    example: "8918e471-f05d-457f-932c-e7cc2e9c7d42"
  })
  id: string;
  @ApiProperty({
    description: "Post's title",
    nullable: false,
    example: "My Post #1"
  })
  title: string;
  @ApiProperty({
    description: "Blog's id",
    nullable: false,
    example: "96140867-9c2e-47c3-a6ee-33ab3ad8b456"
  })
  blogId: string;
  @ApiProperty({
    description: "Blog's name",
    nullable: false,
    example: "Blog #1"
  })
  blogName: string;
};

export class sw_Paginator_PostViewModel extends sw_Paginator {
  @ApiProperty({
    description: "Items",
    nullable: false,
    isArray: true,
    type: PostViewModel
  })
  @ApiProperty()
  items: PostViewModel[];
}