import { ConfigModule } from "@nestjs/config";

const configModule = ConfigModule.forRoot({
  envFilePath: [".env.local", ".env"]
});
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { PostsController } from "./api/posts.controller";
import { PostsRepository } from "./inf/posts.db.repo";
import { PostsQueryRepository } from "./inf/posts.q.repo";
import { PostsService } from "./app/posts.service";
import { CommentsRepository } from "../comments/inf/comments.db.repo";
import { CommentsQueryRepository } from "../comments/inf/comments.q.repo";
import { CommentsService } from "../comments/app/comments.service";
import { BlogsService } from "../blogs/app/blogs.service";
import { BlogsRepository } from "../blogs/inf/blogs.db.repo";
import { UsersModule } from "../users/users.module";
import { AuthModule } from "../auth/auth.module";
import { SecurityModule } from "../security/security.module";
import { BlogsQueryRepository } from "../blogs/inf/blogs.q.repo";
import { CreateBlogsPostUseCase } from "./app/use-cases/create.blogs.post.uc";
import { CheckBlogId } from "../pipes&valid/check.blogId.class.validator";
import { ChangeLikeStatusUseCase } from "./app/use-cases/change.like.status.post.uc";
import { GetPostsHandler } from "./app/queries/get.posts.query";
import { GetPostHandler } from "./app/queries/get.post.query";
import { UpdateBlogsPostUseCase } from "./app/use-cases/update.blogs.post.uc";
import { DeleteBlogsPostUseCase } from "./app/use-cases/delete.blogs.post.uc";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlogOwnerInfo } from "../blogs/dom/blog.entity.owner.info";
import { BlogBanInfo } from "../blogs/dom/blog.entity.ban.info";
import { Post } from "./dom/post.entity";
import { PostLikes } from "./dom/post.entity.likes";
import { Blog } from "../blogs/dom/blog.entity";
import { Comment } from "../comments/dom/comment.entity";
import { CommentLikes } from "../comments/dom/comment.entity.likes";
import { BlogImage } from "../blogs/dom/blog.entity.images";
import { PostImage } from "./dom/post.entity.images";
import { S3StorageAdapter } from "../adapters/files.storage.adapter";
import { BlogSubscription } from "../blogs/dom/blog.entity.subscirption";
import { TelegramAdapter } from "../adapters/telegram.adapter";

const PostUseCases = [
  CreateBlogsPostUseCase,
  CreateBlogsPostUseCase,
  ChangeLikeStatusUseCase,
  UpdateBlogsPostUseCase,
  DeleteBlogsPostUseCase
];
const PostsQueries = [GetPostsHandler, GetPostHandler];
const PostsAdapters = [PostsService, PostsRepository, PostsQueryRepository];
const BlogsAdapters = [BlogsRepository, BlogsQueryRepository, BlogsService];
const CommentsAdapters = [
  CommentsService,
  CommentsRepository,
  CommentsQueryRepository,
  TelegramAdapter
];

@Module({
  imports: [
    configModule,
    CqrsModule,
    // MongooseModule.forFeature([
    //   { name: Post.name, schema: PostSchema },
    //   { name: Blog.name, schema: BlogSchema },
    //   { name: Comment.name, schema: CommentSchema },
    //   { name: Security.name, schema: SecuritySchema },
    //   { name: User.name, schema: UserSchema }
    // ]),
    TypeOrmModule.forFeature([Post, PostLikes, Blog, BlogOwnerInfo,
      BlogBanInfo, BlogImage, Comment, CommentLikes, PostImage, BlogSubscription]),
    AuthModule,
    SecurityModule,
    UsersModule
  ],
  controllers: [PostsController],
  providers: [
    ...PostUseCases,
    ...PostsAdapters,
    ...PostsQueries,
    ...BlogsAdapters,
    ...CommentsAdapters,
    CheckBlogId,
    S3StorageAdapter
  ],
  exports: [...PostsAdapters]
})

export class PostsModule {
}