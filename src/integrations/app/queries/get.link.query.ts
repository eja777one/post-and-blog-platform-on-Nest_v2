import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { NotFoundException } from "@nestjs/common";
import { BlogsQueryRepository } from "../../../blogs/inf/blogs.q.repo";
import { BlogsRepository } from "../../../blogs/inf/blogs.db.repo";

export class GetLinkQuery {
  constructor(public userId: string) {
  };
};

@QueryHandler(GetLinkQuery)
export class GetBlogHandler implements IQueryHandler<GetLinkQuery> {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private blogsRepository: BlogsRepository
  ) {
  };

  async execute(query: GetLinkQuery) {
    const subscription = await this.blogsQueryRepository
      .getSubscription(query.userId);

    if (!subscription) throw new NotFoundException();

    const link = {
      link: `https://t.me/BlogPlatformBot?code=${subscription.secret}`
    };

    console.log(link);

    return link;
  };
};