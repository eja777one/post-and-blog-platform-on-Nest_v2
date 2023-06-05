import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { CommentsQueryRepository } from "../../inf/comments.q.repo";
import { NotFoundException } from "@nestjs/common";

export class GetCommentQuery {
  constructor(public id: string, public userId: string | undefined) {
  };
};

@QueryHandler(GetCommentQuery)
export class GetCommentHandler implements IQueryHandler<GetCommentQuery> {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository) {
  };

  async execute(query: GetCommentQuery) {
    const comment = await this.commentsQueryRepository
      .getViewCommentSQL(query.id, query.userId);
    if (!comment) throw new NotFoundException();
    return comment;
  };
};