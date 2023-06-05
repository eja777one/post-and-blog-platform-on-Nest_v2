import {
  ForbiddenException, NotFoundException, UnauthorizedException
} from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UserViewModel } from "../../../users/users.types";
import { CommentsRepository } from "../../inf/comments.db.repo";
import { CommentsQueryRepository } from "../../inf/comments.q.repo";
import { CommentInputModel } from "../../comments.types";

export class UpdateCommentCommand {
  constructor(
    public id: string,
    public user: UserViewModel,
    public content: CommentInputModel
  ) {
  };
};

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase
  implements ICommandHandler<UpdateCommentCommand> {

  constructor(
    protected commentsRepository: CommentsRepository,
    protected commentsQueryRepository: CommentsQueryRepository
  ) {
  };

  async execute(command: UpdateCommentCommand) {
    if (!command.user) throw new UnauthorizedException();

    const comment = await this.commentsQueryRepository
      .getCommentSQL(command.id);
    if (!comment) throw new NotFoundException();

    if (comment.userId !== command.user.id) throw new ForbiddenException();

    const commentToUpdate = await this.commentsRepository.getComment(command.id);

    commentToUpdate.content = command.content.content;

    const saveComment = await this.commentsRepository
      .saveComment(commentToUpdate);

    // const updated = await this.commentsRepository
    //   .updateCommentSQL(command.id, command.content.content);

    if (!saveComment) throw new NotFoundException();
  };
};