import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { PostDTO } from "../posts.types";
import { LikeDetailsDBModel, LikeStatus } from "../../types";

@Schema()
export class Post {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  shortDescription: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  blogId: string;

  @Prop({ required: true })
  blogName: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ required: true })
  likesCount: number;

  @Prop({ required: true })
  dislikesCount: number;

  @Prop({ required: true })
  isHide: boolean;

  @Prop({ required: true, default: [] })
  usersLikeStatus: LikeDetailsDBModel[];

  static makePost(postDTO: PostDTO, userId: string, PostModel: PostModelType) {
    const newPost = new PostModel({
      userId: userId,
      title: postDTO.title,
      shortDescription: postDTO.shortDescription,
      content: postDTO.content,
      blogId: postDTO.blogId,
      blogName: postDTO.blogName,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      dislikesCount: 0,
      usersLikeStatus: [],
      isHide: false
    });
    return newPost;
  }

  updatePost(postDTO: PostDTO) {
    this.title = postDTO.title;
    this.shortDescription = postDTO.shortDescription;
    this.content = postDTO.content;
    this.blogId = postDTO.blogId;
    this.blogName = postDTO.blogName;
  };

  changeHideStatus() {
    this.isHide = !this.isHide;
  };

  changeLikeStatus(likeStatus: LikeStatus, userId: string, userLogin: string) {

    let currentStatus: LikeStatus = "None";

    let findUsersLike = this.usersLikeStatus
      .find((el: any) => el.userId === userId);

    if (findUsersLike) currentStatus = findUsersLike.likeStatus;

    if (currentStatus === likeStatus) return false;

    if (currentStatus === "None") {
      if (likeStatus === "Like") this.likesCount += 1;
      if (likeStatus === "Dislike") this.dislikesCount += 1;
    }

    if (currentStatus === "Like") {
      if (likeStatus === "None") this.likesCount -= 1;
      if (likeStatus === "Dislike") {
        this.likesCount -= 1;
        this.dislikesCount += 1;
      }
    }

    if (currentStatus === "Dislike") {
      if (likeStatus === "None") this.dislikesCount -= 1;
      if (likeStatus === "Like") {
        this.likesCount += 1;
        this.dislikesCount -= 1;
      }
    }

    const likesData = {
      addedAt: new Date().toISOString(),
      userId: userId,
      login: userLogin,
      likeStatus: likeStatus,
      isBanned: false
    };

    if (!findUsersLike) {
      this.usersLikeStatus.push(likesData);
    } else {
      let j = 0;

      let addedAt: string = "";

      for (let i = 0; i < this.usersLikeStatus.length; i++) {
        if (this.usersLikeStatus[i].userId === userId) {
          j = i;
          addedAt = this.usersLikeStatus[i].addedAt;
        }
      }
      this.usersLikeStatus.splice(j, 1, { ...likesData, addedAt });
    }
    return true;
  };
};

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.methods = {
  updatePost: Post.prototype.updatePost,
  changeLikeStatus: Post.prototype.changeLikeStatus,
  changeHideStatus: Post.prototype.changeHideStatus
};

const postStaticMethods: PostModelStaticType = {
  makePost: Post.makePost
};

PostSchema.statics = postStaticMethods;

export type PostModelStaticType = {
  makePost: (postsDTO: PostDTO, userId: string, PostModel: PostModelType)
    => PostDocument
};

export type PostDocument = HydratedDocument<Post>;

export type PostModelType = Model<PostDocument> & PostModelStaticType;