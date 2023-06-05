import { Module } from "@nestjs/common";
// import { MongooseModule } from "@nestjs/mongoose";
import { CqrsModule } from "@nestjs/cqrs";
import { UsersService } from "./app/users.service";
import { UsersQueryRepository } from "./inf/users.q.repo";
import { UsersRepository } from "./inf/users.db.repo";
import { CreateUserUseCase } from "./app/use-cases/create.user.uc";
import { DeleteUserUseCase } from "./app/use-cases/delete.user.uc";
import { SetBanStatusUseCase } from "./app/use-cases/set.ban.status.uc";
import { GetUsersBySAHandler } from "./app/queries/get.users.by.SA.query";
import { UsersSAController } from "./api/users.sa.controller";
import { CommentsQueryRepository } from "../comments/inf/comments.q.repo";
import { CommentsRepository } from "../comments/inf/comments.db.repo";
import { PostsRepository } from "../posts/inf/posts.db.repo";
import { PostsQueryRepository } from "../posts/inf/posts.q.repo";
import { SecurityRepository } from "../security/inf/security.db.repo";
import { BlogsQueryRepository } from "../blogs/inf/blogs.q.repo";
import { Blog, BlogSchema } from "../blogs/dom/blogs.schema";
import { SetBanStatusByBloggerUseCase } from "./app/use-cases/set.ban.status.by.blogger";
import { GetBlogsBannedUsersHandler } from "./app/queries/get.blogs.banned.users.query";
import { UsersBloggerController } from "./api/users.blogger.controller";
import { CheckBlogId } from "../pipes&valid/check.blogId.class.validator";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlogOwnerInfo } from "../blogs/dom/blog.entity.owner.info";
import { BlogBanInfo } from "../blogs/dom/blog.entity.ban.info";
import { Users } from "./dom/users.entity";
import { UserSentEmails } from "./dom/user.entity.sent.emails";
import { UserEmailConfirmation } from "./dom/user.entity.email.confirmation";
import { UserBlogsBanInfo } from "./dom/user.entity.blogs.ban.info";
import { UserBanInfo } from "./dom/user.entity.ban.info";
import { PassRecovery } from "./dom/pass.rec.entity";
import { Comment } from "../comments/dom/comment.entity";
import { CommentLikes } from "../comments/dom/comment.entity.likes";
import { Post } from "../posts/dom/post.entity";
import { PostLikes } from "../posts/dom/post.entity.likes";
import { Device } from "../security/dom/device.entity";
import { PostImage } from "../posts/dom/post.entity.images";

const usersAdapters = [UsersRepository, UsersQueryRepository, UsersService];
const usersUseCases = [CreateUserUseCase, DeleteUserUseCase, SetBanStatusUseCase,
  SetBanStatusByBloggerUseCase];
const usersQueries = [GetUsersBySAHandler, GetBlogsBannedUsersHandler];

@Module({
  imports: [
    CqrsModule,
    // forwardRef(() => AuthModule),
    // MongooseModule.forFeature([
    //   { name: User.name, schema: UserSchema },
    //   { name: Comment.name, schema: CommentSchema },
    //   { name: Post.name, schema: PostSchema },
    //   { name: Security.name, schema: SecuritySchema },
    //   { name: Blog.name, schema: BlogSchema }
    // ])
    TypeOrmModule.forFeature([Users, UserSentEmails,
      UserEmailConfirmation, UserBlogsBanInfo, UserBanInfo, PassRecovery,
      Comment, CommentLikes, Post, PostLikes, Device, PostImage])
  ],
  controllers: [UsersSAController, UsersBloggerController],
  providers: [
    CommentsQueryRepository,
    CommentsRepository,
    PostsRepository,
    PostsQueryRepository,
    SecurityRepository,
    BlogsQueryRepository,
    CheckBlogId,
    ...usersAdapters,
    ...usersUseCases,
    ...usersQueries
  ],
  exports: [...usersAdapters]
})
export class UsersModule {
}