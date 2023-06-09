import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { PostsRepository } from "../../inf/posts.db.repo";
import { PostsQueryRepository } from "../../inf/posts.q.repo";
import { UserViewModel } from "../../../users/users.types";
import { BlogsQueryRepository } from "../../../blogs/inf/blogs.q.repo";
import { S3StorageAdapter } from "../../../adapters/files.storage.adapter";

export class DeleteBlogsPostCommand {
  constructor(
    public blogId: string,
    public postId: string,
    public user: UserViewModel
  ) {
  };
};

@CommandHandler(DeleteBlogsPostCommand)
export class DeleteBlogsPostUseCase
  implements ICommandHandler<DeleteBlogsPostCommand> {

  constructor(
    protected postsRepository: PostsRepository,
    protected postsQueryRepository: PostsQueryRepository,
    protected blogsQueryRepository: BlogsQueryRepository,
    private fileStorageAdapter: S3StorageAdapter
  ) {
  };

  async execute(command: DeleteBlogsPostCommand) {
    const blog = await this.blogsQueryRepository.getRawBlogSQL(command.blogId);

    if (!blog) throw new NotFoundException();
    if (blog.blogOwnerInfo.userId !== command.user.id)
      throw new ForbiddenException();

    const post = await this.postsQueryRepository.getPostSQL(command.postId);

    if (!post) throw new NotFoundException();
    if (post.blogId !== command.blogId) throw new ForbiddenException();

    const deleteObjects = await this.fileStorageAdapter
      .deletePostFiles(blog.id, post.id);

    if (!deleteObjects) throw new NotFoundException();

    const deletedPost = await this.postsRepository.deletePost(command.postId);
    if (!deletedPost) throw new NotFoundException();
  };
};