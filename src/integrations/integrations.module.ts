import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { AuthModule } from "../auth/auth.module";
import { IntegrationsController } from "./api/integrations.controller";
import { GetBlogHandler } from "./app/queries/get.link.query";
import { BlogsQueryRepository } from "../blogs/inf/blogs.q.repo";
import { BlogsRepository } from "../blogs/inf/blogs.db.repo";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Blog } from "../blogs/dom/blog.entity";
import { BlogOwnerInfo } from "../blogs/dom/blog.entity.owner.info";
import { BlogBanInfo } from "../blogs/dom/blog.entity.ban.info";
import { CommentLikes } from "../comments/dom/comment.entity.likes";
import { BlogImage } from "../blogs/dom/blog.entity.images";
import { BlogSubscription } from "../blogs/dom/blog.entity.subscirption";
import { AddTelegramIdUseCase } from "./app/use-cases/add.telegram.id.uc";

const integrationsUseCases = [AddTelegramIdUseCase];
const integrationsQueries = [GetBlogHandler];
const integrationsAdapters = [BlogsQueryRepository, BlogsRepository];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Blog, BlogOwnerInfo, BlogBanInfo,
      CommentLikes, BlogImage, BlogSubscription]),
    AuthModule
  ],
  controllers: [IntegrationsController],
  providers: [
    ...integrationsAdapters,
    ...integrationsUseCases,
    ...integrationsQueries
  ],
  exports: [...integrationsAdapters]
})

export class IntegrationsModule {
}