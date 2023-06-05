import {
  ForbiddenException, NotFoundException, UnauthorizedException
} from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UserViewModel } from "../../../users/users.types";
import { CommentsRepository } from "../../inf/comments.db.repo";
import { CommentsQueryRepository } from "../../inf/comments.q.repo";

export class DeleteCommentCommand {
  constructor(public id: string, public user: UserViewModel) {
  };
};

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase
  implements ICommandHandler<DeleteCommentCommand> {

  constructor(
    protected commentsRepository: CommentsRepository,
    protected commentsQueryRepository: CommentsQueryRepository
  ) {
  };

  async execute(command: DeleteCommentCommand) {
    if (!command.user) throw new UnauthorizedException();

    const comment = await this.commentsQueryRepository.getCommentSQL(command.id);
    if (!comment) throw new NotFoundException();

    if (comment.userId !== command.user.id) throw new ForbiddenException();

    // const deleted = await this.commentsRepository.deleteCommentSQL(command.id);
    const deleted = await this.commentsRepository.deleteComment(command.id);
    if (!deleted) throw new NotFoundException();
  };
};