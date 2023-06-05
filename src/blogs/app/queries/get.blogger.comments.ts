import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { QueryType } from "../../../types";
import { CommentsQueryRepository } from "../../../comments/inf/comments.q.repo";
import { NotFoundException } from "@nestjs/common";

export class GetBloggerBlogCommentsQuery {
  constructor(public query: QueryType, public userId: string) {
  };
};

@QueryHandler(GetBloggerBlogCommentsQuery)
export class GetBloggerBlogCommentsHandler
  implements IQueryHandler<GetBloggerBlogCommentsQuery> {

  constructor(private readonly commentsQueryRepository: CommentsQueryRepository
  ) {
  };

  async execute(query: GetBloggerBlogCommentsQuery) {
    const comments = await this.commentsQueryRepository
      .getBloggerBlogsCommentsSQL(query.query, query.userId);
    if (!comments) throw new NotFoundException();
    return comments;
  };
};