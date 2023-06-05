import { ConfigModule } from "@nestjs/config";

const configModule = ConfigModule.forRoot({
  envFilePath: [".env.local", ".env"]
});
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CqrsModule } from "@nestjs/cqrs";
import { CommentsController } from "./api/comments.controller";
import { CommentsRepository } from "./inf/comments.db.repo";
import { CommentsQueryRepository } from "./inf/comments.q.repo";
import { CommentsService } from "./app/comments.service";
import { Blog, BlogSchema } from "../blogs/dom/blogs.schema";
import { PostsRepository } from "../posts/inf/posts.db.repo";
import { PostsQueryRepository } from "../posts/inf/posts.q.repo";
import { UsersQueryRepository } from "../users/inf/users.q.repo";
import { User, UserSchema } from "../users/dom/users.schema";
import { AddCommentUseCase } from "./app/use-cases/add.comment.uc";
import { ChangeLikeStatusCommentUseCase } from "./app/use-cases/change.like.status.comment.uc";
import { DeleteCommentUseCase } from "./app/use-cases/delete.comment.uc";
import { UpdateCommentUseCase } from "./app/use-cases/update.comment.uc";
import { GetCommentHandler } from "./app/queries/get.comment.query";
import { GetCommentsHandler } from "./app/queries/get.comments.query";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostLikes } from "../posts/dom/post.entity.likes";
import { Comment } from "./dom/comment.entity";
import { CommentLikes } from "./dom/comment.entity.likes";
import { Post } from "../posts/dom/post.entity";
import { PostImage } from "../posts/dom/post.entity.images";

const commentsUseCases = [
  AddCommentUseCase,
  ChangeLikeStatusCommentUseCase,
  DeleteCommentUseCase,
  UpdateCommentUseCase
];
const commentsQueries = [GetCommentHandler, GetCommentsHandler];
const commentsAdapters = [
  CommentsService,
  CommentsRepository,
  CommentsQueryRepository];
const postsAdapters = [PostsRepository, PostsQueryRepository];

@Module({
  imports: [
    configModule,
    CqrsModule,
    TypeOrmModule.forFeature([Comment, CommentLikes, Post, PostLikes, PostImage])
    // MongooseModule.forFeature([
    //   { name: Comment.name, schema: CommentSchema },
    //   { name: Post.name, schema: PostSchema },
    //   { name: Blog.name, schema: BlogSchema },
    //   { name: User.name, schema: UserSchema }
    // ])
    // AuthModule,
  ],
  controllers: [CommentsController],
  providers: [
    GetCommentsHandler,
    ...commentsQueries,
    ...commentsUseCases,
    ...commentsAdapters,
    ...postsAdapters,
    UsersQueryRepository
  ],
  exports: [CommentsRepository, CommentsQueryRepository]
})

export class CommentsModule {
}