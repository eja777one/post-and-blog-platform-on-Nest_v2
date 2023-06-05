import {
  ForbiddenException, NotFoundException, UnauthorizedException
} from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CommentDTO, CommentInputModel } from "../../comments.types";
import { UserViewModel } from "../../../users/users.types";
import { PostsQueryRepository } from "../../../posts/inf/posts.q.repo";
import { CommentsRepository } from "../../inf/comments.db.repo";
import { CommentsQueryRepository } from "../../inf/comments.q.repo";
import { UsersQueryRepository } from "../../../users/inf/users.q.repo";
import { Comment } from "../../dom/comment.entity";
import { v4 as uuidv4 } from "uuid";

export class AddCommentCommand {
  constructor(
    public user: UserViewModel,
    public postId: string,
    public commentInput: CommentInputModel
  ) {
  };
};

@CommandHandler(AddCommentCommand)
export class AddCommentUseCase implements ICommandHandler<AddCommentCommand> {
  constructor(
    protected postsQueryRepository: PostsQueryRepository,
    protected commentsRepository: CommentsRepository,
    protected commentsQueryRepository: CommentsQueryRepository,
    protected usersQueryRepository: UsersQueryRepository
  ) {
  };

  async execute(command: AddCommentCommand) {
    if (!command.user) throw new UnauthorizedException();

    const user = await this.usersQueryRepository.getUserSQL(command.user.id);
    // console.log(user);
    const post = await this.postsQueryRepository.getPostSQL(command.postId);
    // console.log(post);
    if (!post) throw new NotFoundException();

    const isBanned = user.userBlogsBanInfo?.find(
      (el: any) => el.blogId === post.blogId);

    if (isBanned) throw new ForbiddenException();

    if (user.userBanInfo.isBanned) throw new NotFoundException();

    // const commentDTO = new CommentDTO(command.commentInput.content,
    //   command.user.id, command.user.login, command.postId);

    const comment = new Comment();

    comment.id = uuidv4();
    comment.content = command.commentInput.content;
    comment.userId = command.user.id;
    comment.createdAt = new Date().toISOString();
    comment.postId = command.postId;

    // const commentId = await this.commentsRepository
    //   .createCommentSQL(commentDTO);

    const saveComment = await this.commentsRepository
      .saveComment(comment);

    if (!saveComment) throw new NotFoundException();

    const newComment = await this.commentsQueryRepository
      .getViewCommentSQL(comment.id);

    if (!newComment) throw new NotFoundException();
    return newComment;
  };
};