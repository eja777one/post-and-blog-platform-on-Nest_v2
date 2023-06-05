import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CommentDTO } from '../comments.types';
import { UsersLikeStatus, LikeStatus } from '../../types';

@Schema()
export class Comment {
  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  userLogin: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ required: true })
  postId: string;

  @Prop({ required: true })
  likesCount: number;

  @Prop({ required: true })
  dislikesCount: number;

  @Prop({required: true})
  isHide: boolean;

  @Prop({ required: true, default: [] })
  usersLikeStatus: UsersLikeStatus[];

  static makeComment(commentDTO: CommentDTO, CommentModel: CommentModelType) {
    const newComment = new CommentModel({
      content: commentDTO.content,
      userId: commentDTO.userId,
      userLogin: commentDTO.userLogin,
      createdAt: new Date().toISOString(),
      postId: commentDTO.postId,
      likesCount: 0,
      dislikesCount: 0,
      usersLikeStatus: [],
      isHide: false
    });
    return newComment;
  };

  updateComment(content: string) {
    this.content = content;
  };

  changeHideStatus() {
    this.isHide = !this.isHide
  };

  changeLikeStatus(likeStatus: LikeStatus, userId: string) {
    let currentStatus: LikeStatus = 'None';

    let findUsersLike = this.usersLikeStatus.find((el: any) =>
      (el.userId === userId));

    if (findUsersLike) currentStatus = findUsersLike.likeStatus;

    if (currentStatus === likeStatus) return false;

    if (currentStatus === 'None') {
      if (likeStatus === 'Like') this.likesCount += 1;
      if (likeStatus === 'Dislike') this.dislikesCount += 1;
    };

    if (currentStatus === 'Like') {
      if (likeStatus === 'None') this.likesCount -= 1;
      if (likeStatus === 'Dislike') {
        this.likesCount -= 1;
        this.dislikesCount += 1;
      };
    };

    if (currentStatus === 'Dislike') {
      if (likeStatus === 'None') this.dislikesCount -= 1;
      if (likeStatus === 'Like') {
        this.likesCount += 1;
        this.dislikesCount -= 1;
      };
    };

    if (!findUsersLike) this.usersLikeStatus.push({ userId, likeStatus, isBanned: false });
    else {
      let j = 0;

      for (let i = 0; i < this.usersLikeStatus.length; i++) {
        if (this.usersLikeStatus[i].userId === userId) j = i
      };
      this.usersLikeStatus.splice(j, 1, { userId, likeStatus, isBanned: false  });
    };
    return true;
  };
};

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.methods = {
  updateComment: Comment.prototype.updateComment,
  changeLikeStatus: Comment.prototype.changeLikeStatus,
  changeHideStatus: Comment.prototype.changeHideStatus,
};

const commentStaticMethods: CommentModelStaticType = {
  makeComment: Comment.makeComment
};

CommentSchema.statics = commentStaticMethods;

export type CommentModelStaticType = {
  makeComment: (commentDTO: CommentDTO, CommentModel: CommentModelType)
    => CommentDocument
};

export type CommentDocument = HydratedDocument<Comment>;

export type CommentModelType = Model<CommentDocument> & CommentModelStaticType;