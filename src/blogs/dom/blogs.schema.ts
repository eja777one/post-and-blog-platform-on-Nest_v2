import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { BlogInputModel } from "../blogs.types";
import { UserViewModel } from "../../users/users.types";

@Schema({ _id: false })
class BlogOwnerInfo {
  @Prop({ required: true })
  userId: string;
  @Prop({ required: true })
  userLogin: string;
}

@Schema({ _id: false })
class BanInfo {
  @Prop({ required: true })
  isBanned: boolean;
  @Prop({ required: false })
  banDate: string | null;
}

@Schema()
export class Blog {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  description: string;
  @Prop({ required: true })
  websiteUrl: string;
  @Prop({ required: true })
  createdAt: string;
  @Prop({ required: true })
  isMembership: boolean;
  @Prop({ required: true, type: BlogOwnerInfo })
  blogOwnerInfo: BlogOwnerInfo;
  @Prop({ required: true, type: BanInfo })
  banInfo: BanInfo;

  updateBlog(blogsDTO: BlogInputModel) {
    this.name = blogsDTO.name;
    this.description = blogsDTO.description;
    this.websiteUrl = blogsDTO.websiteUrl;
  };

  bindWithUser(userId: string, userLogin: string) {
    this.blogOwnerInfo.userId = userId;
    this.blogOwnerInfo.userLogin = userLogin;
  };

  setBanStatus(banBlog: boolean) {
    if (banBlog === this.banInfo.isBanned) return;
    if (banBlog) {
      this.banInfo.isBanned = banBlog;
      this.banInfo.banDate = new Date().toISOString();
    } else {
      this.banInfo.isBanned = banBlog;
      this.banInfo.banDate = null;
    }
  };

  static makeBlog(blogsDTO: BlogInputModel, user: UserViewModel,
                  BlogModel: BlogModelType) {
    const newBlog = new BlogModel({
      name: blogsDTO.name,
      description: blogsDTO.description,
      websiteUrl: blogsDTO.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
      blogOwnerInfo: {
        userId: user.id,
        userLogin: user.login
      },
      banInfo: {
        isBanned: false,
        banDate: null
      }
    });
    return newBlog;
  };

  static makeTestBlog(blogsDTO: BlogInputModel, BlogModel: BlogModelType) {
    const newBlog = new BlogModel({
      name: blogsDTO.name,
      description: blogsDTO.description,
      websiteUrl: blogsDTO.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
      blogOwnerInfo: {
        userId: "none",
        userLogin: "none"
      },
      banInfo: {
        isBanned: false,
        banDate: null
      }
    });
    return newBlog;
  };
};

export const BlogSchema = SchemaFactory.createForClass(Blog);

BlogSchema.methods = {
  updateBlog: Blog.prototype.updateBlog,
  bindWithUser: Blog.prototype.bindWithUser,
  setBanStatus: Blog.prototype.setBanStatus
};

const blogStaticMethods: BlogModelStaticType = {
  makeBlog: Blog.makeBlog,
  makeTestBlog: Blog.makeTestBlog
};

BlogSchema.statics = blogStaticMethods;

export type BlogModelStaticType = {
  makeBlog: (blogsDTO: BlogInputModel, user: UserViewModel,
             BlogModel: BlogModelType) => BlogDocument,
  makeTestBlog: (blogsDTO: BlogInputModel, BlogModel: BlogModelType)
    => BlogDocument,
};

export type BlogDocument = HydratedDocument<Blog>;

export type BlogModelType = Model<BlogDocument> & BlogModelStaticType;