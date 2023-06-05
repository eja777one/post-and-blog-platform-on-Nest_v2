import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { QueryType } from "../../../types";
import { PostsQueryRepository } from "../../inf/posts.q.repo";
import { BlogsQueryRepository } from "../../../blogs/inf/blogs.q.repo";
import { NotFoundException } from "@nestjs/common";

export class GetBlogsPostsQuery {
  constructor(
    public query: QueryType,
    public blogId: string,
    public userId: string
  ) {
  };
};

@QueryHandler(GetBlogsPostsQuery)
export class GetBlogsPostsHandler implements IQueryHandler<GetBlogsPostsQuery> {
  constructor(
    private readonly postQueryRepository: PostsQueryRepository,
    private readonly blogsQueryRepository: BlogsQueryRepository
  ) {
  };

  async execute(query: GetBlogsPostsQuery) {
    const blog = await this.blogsQueryRepository.getBlogSQL(query.blogId);
    if (!blog) throw new NotFoundException();
    const posts = await this.postQueryRepository.getViewPostsSQL(
      query.query, query.blogId, query.userId);
    return posts;
  };
};