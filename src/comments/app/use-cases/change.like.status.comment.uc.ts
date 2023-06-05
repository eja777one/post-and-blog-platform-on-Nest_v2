import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CommentsRepository } from "../../inf/comments.db.repo";
import { CommentsQueryRepository } from "../../inf/comments.q.repo";
import { LikeStatus } from "../../../types";
import { CommentLikes } from "../../dom/comment.entity.likes";
import { countLike } from "../../../application/countLikes";

export class ChangeLikeStatusCommentCommand {
  constructor(
    public commentId: string,
    public likeStatus: LikeStatus,
    public userId: string
  ) {
  };
};

@CommandHandler(ChangeLikeStatusCommentCommand)
export class ChangeLikeStatusCommentUseCase
  implements ICommandHandler<ChangeLikeStatusCommentCommand> {

  constructor(
    protected commentsRepository: CommentsRepository,
    protected commentsQueryRepository: CommentsQueryRepository
  ) {
  };

  async execute(command: ChangeLikeStatusCommentCommand) {
    if (!command.userId) throw new UnauthorizedException();

    const comment = await this.commentsQueryRepository
      .getCommentSQL(command.commentId); // like = None
    if (!comment) throw new NotFoundException();

    // const changedStatus = await this.commentsRepository.changeLikeStatusSQL(
    //   command.commentId, command.likeStatus, command.userId);

    const newComment = await this.commentsRepository
      .getComment(command.commentId);
    const commentLike = await this.commentsRepository
      .getCommentLike(command.commentId, command.userId);

    if (!commentLike) {
      const newCommentLike = new CommentLikes();
      newCommentLike.commentId = newComment.id;
      newCommentLike.addedAt = new Date().toISOString();
      newCommentLike.userId = command.userId;
      newCommentLike.likeStatus = command.likeStatus;

      const saveCommentLike = await this.commentsRepository
        .saveCommentLike(newCommentLike);

      command.likeStatus === "Like" ? newComment.likesCount++ :
        newComment.dislikesCount++;

      const saveComment = await this.commentsRepository.saveComment(newComment);
      if (!saveCommentLike || !saveComment) throw new NotFoundException();
      return;
    } else if (commentLike.likeStatus === command.likeStatus) {
      return;
    } else {
      const calculateLikes = countLike(commentLike.likeStatus,
        command.likeStatus, newComment.likesCount, newComment.dislikesCount);

      commentLike.addedAt = new Date().toISOString();
      commentLike.likeStatus = command.likeStatus;

      const saveCommentLike = await this.commentsRepository
        .saveCommentLike(commentLike);

      newComment.likesCount = calculateLikes.likes;
      newComment.dislikesCount = calculateLikes.dislikes;

      const saveComment = await this.commentsRepository.saveComment(newComment);
      if (!saveCommentLike || !saveComment) throw new NotFoundException();
    }

    // if (!changedStatus) throw new NotFoundException();
  };
};