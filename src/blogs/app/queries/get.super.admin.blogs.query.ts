import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BlogsQueryRepository } from "../../inf/blogs.q.repo";
import { QueryType } from "../../../types";

export class GetSuperAdminBlogsQuery {
  constructor(public query: QueryType) {
  };
};

@QueryHandler(GetSuperAdminBlogsQuery)
export class GetSuperAdminBlogsHandler
  implements IQueryHandler<GetSuperAdminBlogsQuery> {

  constructor(private readonly blogsQueryRepository: BlogsQueryRepository) {
  };

  async execute(query: GetSuperAdminBlogsQuery) {
    const blogs = await this.blogsQueryRepository
      .getSuperAdminBlogsSQL(query.query);
    return blogs;
  };
};