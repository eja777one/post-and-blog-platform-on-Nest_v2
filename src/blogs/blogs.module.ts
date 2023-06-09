import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import { BlogsController } from "./api/blogs.controller";
import { BlogsRepository } from "./inf/blogs.db.repo";
import { BlogsQueryRepository } from "./inf/blogs.q.repo";
import { BlogsService } from "./app/blogs.service";
import { Security, SecuritySchema } from "../security/dom/security.schema";
import { UpdateBlogUseCase } from "./app/use-cases/update.blog.uc";
import { CreateBlogUseCase } from "./app/use-cases/create.blog.uc";
import { DeleteBlogUseCase } from "./app/use-cases/delete.blog.uc";
import { GetBlogHandler } from "./app/queries/get.blog.query";
import { GetBlogsHandler } from "./app/queries/get.blogs.query";
import { AuthModule } from "../auth/auth.module";
import { PostsModule } from "../posts/posts.module";
import { UsersQueryRepository } from "../users/inf/users.q.repo";
import { User, UserSchema } from "../users/dom/users.schema";
import { BloggerBlogsController } from "./api/blogs.blogger.controller";
import { GetBloggerBlogsHandler } from "./app/queries/get.blogger.blogs.query";
import { bindBlogWithUserUseCase } from "./app/use-cases/bind.blog.with.user.uc";
import { GetSuperAdminBlogsHandler } from "./app/queries/get.super.admin.blogs.query";
import { SuperAdminBlogsController } from "./api/blogs.sa.controller";
import { CreateTestBlogUseCase } from "./app/use-cases/create.test.blog.uc";
import { SetBanStatusForBlogUseCase } from "./app/use-cases/set.ban.status.for.blog";
import { CommentsQueryRepository } from "../comments/inf/comments.q.repo";
import { CommentsRepository } from "../comments/inf/comments.db.repo";
import { GetBloggerBlogCommentsHandler } from "./app/queries/get.blogger.comments";
import { GetBlogsPostsHandler } from "../posts/app/queries/get.blogs.posts.query";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Blog } from "./dom/blog.entity";
import { BlogOwnerInfo } from "./dom/blog.entity.owner.info";
import { BlogBanInfo } from "./dom/blog.entity.ban.info";
import { Comment } from "../comments/dom/comment.entity";
import { CommentLikes } from "../comments/dom/comment.entity.likes";
import { UploadBlogWallpaperUseCase } from "./app/use-cases/upload.blog.wallpaper.uc";
import { S3StorageAdapter } from "../adapters/files.storage.adapter";
import { BlogImage } from "./dom/blog.entity.images";
import { UploadBlogMainImageUseCase } from "./app/use-cases/upload.blog.main.image.uc";
import { UploadPostMainImageUseCase } from "./app/use-cases/upload.post.main.image.uc";
import { SubscribeToBlogUseCase } from "./app/use-cases/subscribe.to.blog.uc";
import { BlogSubscription } from "./dom/blog.entity.subscirption";
import { DeleteSubscribeUseCase } from "./app/use-cases/delete.subscribe.uc";

const blogsUseCases = [
  UpdateBlogUseCase,
  CreateBlogUseCase,
  DeleteBlogUseCase,
  bindBlogWithUserUseCase,
  CreateTestBlogUseCase,
  SetBanStatusForBlogUseCase,
  UploadBlogWallpaperUseCase,
  UploadBlogMainImageUseCase,
  UploadPostMainImageUseCase,
  SubscribeToBlogUseCase,
  DeleteSubscribeUseCase
];
const blogsQueries = [
  GetBlogHandler,
  GetBlogsHandler,
  GetBloggerBlogsHandler,
  GetSuperAdminBlogsHandler,
  GetBloggerBlogCommentsHandler,
  GetBlogsPostsHandler,
];
const blogsAdapters = [BlogsService, BlogsRepository, BlogsQueryRepository];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Blog, BlogOwnerInfo, BlogBanInfo, Comment,
      CommentLikes, BlogImage, BlogSubscription]),
    // MongooseModule.forFeature([
    //   { name: Blog.name, schema: BlogSchema },
    //   { name: Security.name, schema: SecuritySchema },
    //   { name: User.name, schema: UserSchema },
    //   { name: Comment.name, schema: CommentSchema },
    // ]),
    AuthModule,
    PostsModule
  ],
  controllers: [
    BlogsController,
    BloggerBlogsController,
    SuperAdminBlogsController
  ],
  providers: [
    ...blogsAdapters,
    ...blogsUseCases,
    ...blogsQueries,
    UsersQueryRepository,
    CommentsQueryRepository,
    CommentsRepository,
    S3StorageAdapter
  ],
  exports: [...blogsAdapters]
})

export class BlogsModule {
}