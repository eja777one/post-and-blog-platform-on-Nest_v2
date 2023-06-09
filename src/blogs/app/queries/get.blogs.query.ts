import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BlogsQueryRepository } from "../../inf/blogs.q.repo";
import { QueryType } from "../../../types";

export class GetBlogsQuery {
  constructor(public query: QueryType, public userId: string) {
  };
};

@QueryHandler(GetBlogsQuery)
export class GetBlogsHandler implements IQueryHandler<GetBlogsQuery> {
  constructor(private readonly blogsQueryRepository: BlogsQueryRepository) {
  };

  async execute(query: GetBlogsQuery) {
    const blogs = await this.blogsQueryRepository
      .getPublicViewBlogsSQL(query.query, query.userId);
    return blogs;
  };
};