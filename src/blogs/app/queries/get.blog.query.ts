import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BlogsQueryRepository } from "../../inf/blogs.q.repo";
import { NotFoundException } from "@nestjs/common";

export class GetBlogQuery {
  constructor(public id: string) {
  };
};

@QueryHandler(GetBlogQuery)
export class GetBlogHandler implements IQueryHandler<GetBlogQuery> {
  constructor(private readonly blogsQueryRepository: BlogsQueryRepository) {
  };

  async execute(query: GetBlogQuery) {
    const blog = await this.blogsQueryRepository.getBlogSQL(query.id);
    if (!blog) throw new NotFoundException();
    return blog;
  };
};