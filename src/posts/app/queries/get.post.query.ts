import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PostsQueryRepository } from "../../inf/posts.q.repo";
import { NotFoundException } from "@nestjs/common";

export class GetPostQuery {
  constructor(public postId: string, public userId: string | undefined) {
  };
};

@QueryHandler(GetPostQuery)
export class GetPostHandler implements IQueryHandler<GetPostQuery> {
  constructor(private readonly postQueryRepository: PostsQueryRepository) {
  };

  async execute(query: GetPostQuery) {
    const post = await this.postQueryRepository
      .getViewPostSQL(query.postId, query.userId);
    if (!post) throw new NotFoundException();
    return post;
  };
};