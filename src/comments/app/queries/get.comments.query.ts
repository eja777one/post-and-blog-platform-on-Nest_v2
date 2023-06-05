import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { CommentsQueryRepository } from "../../inf/comments.q.repo";
import { QueryType } from "../../../types";
import { NotFoundException } from "@nestjs/common";
import { PostsQueryRepository } from "../../../posts/inf/posts.q.repo";

export class GetCommentsQuery {
  constructor(
    public queryForSearch: QueryType,
    public postId: string,
    public userId: string | undefined
  ) {
  };
};

@QueryHandler(GetCommentsQuery)
export class GetCommentsHandler implements IQueryHandler<GetCommentsQuery> {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository
  ) {
  };

  async execute(query: GetCommentsQuery) {
    const post = await this.postsQueryRepository.getPostSQL(query.postId);
    if (!post) throw new NotFoundException();

    const comments = await this.commentsQueryRepository
      .getCommentsSQL(query.queryForSearch, query.postId, query.userId);
    return comments;
  };
};