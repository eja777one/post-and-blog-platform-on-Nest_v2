import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { QueryType } from "../../../types";
import { PostsQueryRepository } from "../../inf/posts.q.repo";

export class GetPostsQuery {
  constructor(public query: QueryType, public userId: string | undefined) {
  };
};

@QueryHandler(GetPostsQuery)
export class GetPostsHandler implements IQueryHandler<GetPostsQuery> {
  constructor(private readonly postQueryRepository: PostsQueryRepository) {
  };

  async execute(query: GetPostsQuery) {
    const posts = await this.postQueryRepository
      .getViewPostsSQL(query.query, undefined, query.userId);
    return posts;
  };
};