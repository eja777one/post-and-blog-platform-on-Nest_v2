import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BlogsQueryRepository } from "../../inf/blogs.q.repo";
import { QueryType } from "../../../types";

export class GetBloggerBlogsQuery {
  constructor(public query: QueryType, public userId: string) {
  };
};

@QueryHandler(GetBloggerBlogsQuery)
export class GetBloggerBlogsHandler
  implements IQueryHandler<GetBloggerBlogsQuery> {

  constructor(private readonly blogsQueryRepository: BlogsQueryRepository) {
  };

  async execute(query: GetBloggerBlogsQuery) {
    const blogs = await this.blogsQueryRepository
      .getBlogsSQL(query.query, query.userId);

    return blogs;
  };
};