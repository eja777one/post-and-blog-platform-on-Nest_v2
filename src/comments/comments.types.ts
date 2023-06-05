import { IsString, Length } from "class-validator";
import { makeErorrMessage } from "../application/make.error.message";
import { LikesInfoViewModel, sw_Paginator, UsersLikeStatus } from "../types";
import { Transform, TransformFnParams } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { PostInfo } from "../posts/posts.types";

export class CommentInputModel {
  @ApiProperty({
    description: "Comment's content",
    minLength: 20,
    maxLength: 300,
    nullable: false,
    example: "It is really cool post! I recommend it to my friend"
  })
  @IsString(makeErorrMessage("content"))
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(20, 300, makeErorrMessage("content"))
  content: string;
};

export class CommentatorInfo {
  @ApiProperty({
    description: "User's id",
    nullable: false,
    example: "05468353-3877-49e2-80db-160f82c7a0eb"
  })
  userId: string;
  @ApiProperty({
    description: "User's login",
    nullable: false,
    example: "eja777one"
  })
  userLogin: string;
};

export class CommentViewModel {
  @ApiProperty({
    description: "Comment's id",
    nullable: false,
    example: "dcc34bb9-f6d9-4e04-b672-11647a57cdfb"
  })
  id: string;
  @ApiProperty({
    description: "Comment's content",
    nullable: false,
    example: "It is really cool post! I recommend it to my friend"
  })
  content: string;
  @ApiProperty({
    description: "Comment's owner info",
    nullable: false,
    type: CommentatorInfo
  })
  commentatorInfo: CommentatorInfo;
  @ApiProperty({
    description: "Comment's added date",
    nullable: false,
    example: "2023-05-16T05:19:17.757Z"
  })
  createdAt: string;
  @ApiProperty({
    description: "Comment's likes info",
    nullable: false,
    type: LikesInfoViewModel
  })
  likesInfo: LikesInfoViewModel;
};

export class CommentWithPostViewModel {
  @ApiProperty({
    description: "Comment's id",
    nullable: false,
    example: "dcc34bb9-f6d9-4e04-b672-11647a57cdfb"
  })
  id: string;
  @ApiProperty({
    description: "Comment's content",
    nullable: false,
    example: "It is really cool post! I recommend it to my friend"
  })
  content: string;
  @ApiProperty({
    description: "Comment's owner info",
    nullable: false,
    type: CommentatorInfo
  })
  commentatorInfo: CommentatorInfo;
  @ApiProperty({
    description: "Comment's added date",
    nullable: false,
    example: "2023-05-16T05:19:17.757Z"
  })
  createdAt: string;
  @ApiProperty({
    description: "Comment's likes info",
    nullable: false,
    type: LikesInfoViewModel
  })
  likesInfo: LikesInfoViewModel;
  @ApiProperty({
    description: "Comment's likes info",
    nullable: false,
    type: PostInfo
  })
  postInfo: PostInfo;
};

export class CommentDTO {
  constructor(
    public content: string,
    public userId: string,
    public userLogin: string,
    public postId: string
  ) {
  }
};

export class CommentDBModel {
  constructor(
    // public _id: ObjectID,
    public content: string,
    public userId: string,
    public userLogin: string,
    public createdAt: string,
    public postId: string,
    public likesCount: number,
    public dislikesCount: number,
    public usersLikeStatus: UsersLikeStatus[]
  ) {
  }
};

export class sw_Paginator_CommentWithPostViewModel extends sw_Paginator {
  @ApiProperty({
    description: "Items",
    nullable: false,
    isArray: true,
    type: CommentWithPostViewModel
  })
  @ApiProperty()
  items: CommentWithPostViewModel[];
}

export class sw_Paginator_CommentViewModel extends sw_Paginator {
  @ApiProperty({
    description: "Items",
    nullable: false,
    isArray: true,
    type: CommentViewModel
  })
  @ApiProperty()
  items: CommentViewModel[];
}