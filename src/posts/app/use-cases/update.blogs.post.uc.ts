import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { BlogsQueryRepository } from "../../../blogs/inf/blogs.q.repo";
import { PostInputModelNoId } from "../../posts.types";
import { PostsRepository } from "../../inf/posts.db.repo";
import { PostsQueryRepository } from "../../inf/posts.q.repo";
import { UserViewModel } from "../../../users/users.types";

export class UpdateBlogsPostCommand {
  constructor(
    public blogId: string,
    public postId: string,
    public postInput: PostInputModelNoId,
    public user: UserViewModel
  ) {
  };
};

@CommandHandler(UpdateBlogsPostCommand)
export class UpdateBlogsPostUseCase
  implements ICommandHandler<UpdateBlogsPostCommand> {

  constructor(
    protected blogsQueryRepository: BlogsQueryRepository,
    protected postsRepository: PostsRepository,
    protected postsQueryRepository: PostsQueryRepository
  ) {
  };

  async execute(command: UpdateBlogsPostCommand) {
    const blog = await this.blogsQueryRepository.getRawBlogSQL(command.blogId);
    if (!blog) throw new NotFoundException();
    if (blog.blogOwnerInfo.userId !== command.user.id)
      throw new ForbiddenException();

    const post = await this.postsQueryRepository.getPostSQL(command.postId);
    if (!post) throw new NotFoundException();
    if (post.blogId !== command.blogId) throw new ForbiddenException();

    if (
      command.postInput.title === post.title &&
      command.postInput.shortDescription === post.shortDescription &&
      command.postInput.content === post.content
    ) return;

    // const result = await this.postsRepository.updatePostSQL(
    //   command.postId, command.postInput);
    //
    // if (!result) throw new NotFoundException();

    const postToUpdate = await this.postsRepository.getPost(post.id);

    postToUpdate.title = command.postInput.title;
    postToUpdate.shortDescription = command.postInput.shortDescription;
    postToUpdate.content = command.postInput.content;

    const savePost = await this.postsRepository.savePost(postToUpdate);
    if (!savePost) throw new NotFoundException();
  };
};