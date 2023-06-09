// import { ObjectID } from "bson";
import { IsBoolean, IsString, Length, Matches } from "class-validator";
import { makeErorrMessage } from "../application/make.error.message";
import { Transform, TransformFnParams } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { sw_Paginator } from "../types";

export class BlogInputModel {
  @ApiProperty({
    description: "Blog's name",
    nullable: false,
    minLength: 1,
    maxLength: 15,
    example: "Blog #1"
  })
  @IsString(makeErorrMessage("name"))
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 15, makeErorrMessage("name"))
  name: string;

  @ApiProperty({
    description: "Blog's description",
    nullable: false,
    minLength: 1,
    maxLength: 500,
    example: "Blog #1 - is best blog in the World!"
  })
  @IsString(makeErorrMessage("description"))
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 500, makeErorrMessage("description"))
  description: string;

  @ApiProperty({
    description: "Blog's websiteUrl",
    nullable: false,
    minLength: 1,
    maxLength: 100,
    example: "https://blogNumberOne.com"
  })
  @IsString(makeErorrMessage("websiteUrl"))
  @Length(1, 100, makeErorrMessage("websiteUrl"))
  @Matches(
    new RegExp("^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+\.)*\/?$"),
    makeErorrMessage("websiteUrl"))
  websiteUrl: string;
};

export type BlogPostInputModel = {
  title: string
  shortDescription: string
  content: string
};

export class PhotoSizeViewModel {
  @ApiProperty({
    description: "Wallpaper URL",
    nullable: false,
    example: "/...."
  })
  url: string;
  @ApiProperty({
    description: "Wallpaper width in px. Must be 1028",
    nullable: false,
    example: 0
  })
  width: number;
  @ApiProperty({
    description: "Wallpaper height in px. Must be 312",
    nullable: false,
    example: 0
  })
  height: number;
  @ApiProperty({
    description: "Wallpaper size. Max file size 100KB",
    nullable: false,
    example: 100
  })
  fileSize: number;
}

export class BlogsImagesViewModel {
  @ApiProperty({
    description: "Wallpaper info",
    nullable: false,
    type: PhotoSizeViewModel
  })
  wallpaper: PhotoSizeViewModel;
  @ApiProperty({
    description: "Wallpapers array",
    nullable: false,
    isArray: true,
    type: PhotoSizeViewModel
  })
  main: PhotoSizeViewModel[];
}

export class PostImagesViewModel {
  @ApiProperty({
    description: "Must contain original photo size (940x432)" +
      " and middle photo (300x180) and small (149x96)",
    nullable: false,
    isArray: true,
    type: PhotoSizeViewModel
  })
  main: PhotoSizeViewModel[];
}

export class BlogViewModel {
  @ApiProperty({
    description: "Blog's id",
    nullable: false,
    example: "96140867-9c2e-47c3-a6ee-33ab3ad8b456"
  })
  id: string;
  @ApiProperty({
    description: "Blog's name",
    nullable: false,
    example: "Blog #1"
  })
  name: string;
  @ApiProperty({
    description: "Blog's description",
    nullable: false,
    example: "Blog #1 - is best blog in the World!"
  })
  description: string;
  @ApiProperty({
    description: "Blog's websiteUrl",
    nullable: false,
    example: "https://blogNumberOne.com"
  })
  websiteUrl: string;
  @ApiProperty({
    description: "Blog's created date",
    nullable: false,
    example: "2023-05-14T17:00:08.317Z"
  })
  createdAt: string;
  @ApiProperty({
    description: "Some value (archive)",
    nullable: false,
    example: "false"
  })
  isMembership: boolean;
  @ApiProperty({
    description: "Blog's images info",
    nullable: false,
    type: BlogsImagesViewModel
  })
  images: BlogsImagesViewModel;
};

type SubscriptionStatuses = "Subscribed" | "Unsubscribed" | "None ";

export class PublicBlogViewModel extends BlogViewModel {
  @ApiProperty({
    description: "Show user's subscription status (Subscribed, Unsubscribed, None)",
    nullable: false,
    example: "Subscribed"
  })
  currentUserSubscriptionStatus: SubscriptionStatuses;
  @ApiProperty({
    description: "Show blogs subscribers count",
    nullable: false,
    example: 0
  })
  subscribersCount: number;
}

class BlogOwnerInfo {
  @ApiProperty({
    description: "User's id",
    nullable: false,
    example: "96140867-9c2e-47c3-a6ee-33ab3ad8b456"
  })
  userId: string;
  @ApiProperty({
    description: "User's login",
    nullable: false,
    example: "eja777one"
  })
  userLogin: string;
};

class BanInfo {
  @ApiProperty({
    description: "True - if blog is banned",
    nullable: false,
    example: false
  })
  isBanned: boolean;
  @ApiProperty({
    description: "Ban date - if blog is banned",
    nullable: false,
    example: "2023-05-14T17:00:08.317Z"
  })
  banDate: string;
};

export class SuperAdminBlogViewModel {
  @ApiProperty({
    description: "Blog's id",
    nullable: false,
    example: "96140867-9c2e-47c3-a6ee-33ab3ad8b456"
  })
  id: string;
  @ApiProperty({
    description: "Blog's name",
    nullable: false,
    example: "Blog #1"
  })
  name: string;
  @ApiProperty({
    description: "Blog's description",
    nullable: false,
    example: "Blog #1 - is best blog in the World!"
  })
  description: string;
  @ApiProperty({
    description: "Blog's websiteUrl",
    nullable: false,
    example: "https://blogNumberOne.com"
  })
  websiteUrl: string;
  @ApiProperty({
    description: "Blog's created date",
    nullable: false,
    example: "2023-05-14T17:00:08.317Z"
  })
  createdAt: string;
  @ApiProperty({
    description: "Some value (archive)",
    nullable: false,
    example: "false"
  })
  isMembership: boolean;
  @ApiProperty({
    description: "Blog's owner info",
    nullable: false,
    type: BlogOwnerInfo
  })
  blogOwnerInfo: BlogOwnerInfo;
  @ApiProperty({
    description: "Blog's ban info",
    nullable: false,
    type: BanInfo
  })
  banInfo: BanInfo;
};

export class BlogDBModel {
  constructor(
    // public _id: ObjectID,
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt: string,
    public isMembership: boolean
  ) {
  }
};

export type BlogDBInputModel = {
  name: string
  description: string
  websiteUrl: string
  createdAt: string
};

export type BloggerCommentViewModel = {
  id: string,
  content: string,
  commentatorInfo: {
    userId: string,
    userLogin: string
  },
  createdAt: string,
  postInfo: {
    id: string,
    title: string,
    blogId: string,
    blogName: string
  },
  likesInfo: {
    likesCount: number,
    dislikesCount: number,
    myStatus: string
  }
};

export class SaBanBlogInputModel {
  @ApiProperty({
    description: "If SA want to ban blog - true, else false",
    nullable: false,
    example: true
  })
  @IsBoolean(makeErorrMessage("isBanned"))
  isBanned: boolean;
};

export class sw_Paginator_BlogViewModel extends sw_Paginator {
  @ApiProperty({
    description: "Items",
    nullable: false,
    isArray: true,
    type: BlogViewModel
  })
  @ApiProperty()
  items: BlogViewModel[];
}

export class sw_Paginator_SuperAdminBlogViewModel extends sw_Paginator {
  @ApiProperty({
    description: "Items",
    nullable: false,
    isArray: true,
    type: SuperAdminBlogViewModel
  })
  @ApiProperty()
  items: SuperAdminBlogViewModel[];
}