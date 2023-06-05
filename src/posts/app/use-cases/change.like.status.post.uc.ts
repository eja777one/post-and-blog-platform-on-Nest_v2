import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PostsRepository } from "../../inf/posts.db.repo";
import { BlogsQueryRepository } from "../../../blogs/inf/blogs.q.repo";
import { PostsQueryRepository } from "../../inf/posts.q.repo";
import { LikeStatus } from "../../../types";
import { CommentLikes } from "../../../comments/dom/comment.entity.likes";
import { PostLikes } from "../../dom/post.entity.likes";
import { countLike } from "../../../application/countLikes";

export class ChangeLikeStatusCommand {
  constructor(
    public postId: string,
    public likeStatus: LikeStatus,
    public userId: string
  ) {
  };
};

@CommandHandler(ChangeLikeStatusCommand)
export class ChangeLikeStatusUseCase
  implements ICommandHandler<ChangeLikeStatusCommand> {

  constructor(
    protected postsRepository: PostsRepository,
    protected blogsQueryRepository: BlogsQueryRepository,
    protected postsQueryRepository: PostsQueryRepository
  ) {
  };

  async execute(command: ChangeLikeStatusCommand) {
    if (!command.userId) throw new UnauthorizedException();

    const post = await this.postsQueryRepository.getPostSQL(command.postId);
    if (!post) throw new NotFoundException();

    // const changedStatus = await this.postsRepository
    //   .changeLikeStatusSQL(command.postId, command.likeStatus, command.userId);
    //
    // if (!changedStatus) throw new NotFoundException();

    const newPost = await this.postsRepository.getPost(command.postId);
    const postLike = await this.postsRepository
      .getPostLike(command.postId, command.userId);

    if (!postLike) {
      const newPostLike = new PostLikes();
      newPostLike.postId = newPost.id;
      newPostLike.addedAt = new Date().toISOString();
      newPostLike.userId = command.userId;
      newPostLike.likeStatus = command.likeStatus;

      const savePostLike = await this.postsRepository
        .savePostLike(newPostLike);

      command.likeStatus === "Like" ? newPost.likesCount++ :
        newPost.dislikesCount++;

      const savePost = await this.postsRepository.savePost(newPost);
      if (!savePostLike || !savePost) throw new NotFoundException();
      return;
    } else if (postLike.likeStatus === command.likeStatus) {
      return;
    } else {
      const calculateLikes = countLike(postLike.likeStatus, command.likeStatus,
        newPost.likesCount, newPost.dislikesCount);

      postLike.addedAt = new Date().toISOString();
      postLike.likeStatus = command.likeStatus;

      const savePostLike = await this.postsRepository.savePostLike(postLike);

      newPost.likesCount = calculateLikes.likes;
      newPost.dislikesCount = calculateLikes.dislikes;

      const savePost = await this.postsRepository.savePost(newPost);
      if (!savePostLike || !savePost) throw new NotFoundException();
    }
  };
};