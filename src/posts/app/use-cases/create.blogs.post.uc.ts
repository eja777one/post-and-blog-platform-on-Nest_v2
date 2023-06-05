import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { PostsRepository } from "../../inf/posts.db.repo";
import { PostInputModelNoId } from "../../posts.types";
import { BlogsQueryRepository } from "../../../blogs/inf/blogs.q.repo";
import { PostsQueryRepository } from "../../inf/posts.q.repo";
import { UserViewModel } from "../../../users/users.types";
import { Post } from "../../dom/post.entity";
import { v4 as uuidv4 } from "uuid";

export class CreateBlogsPostCommand {
  constructor(
    public blogId: string,
    public postInput: PostInputModelNoId,
    public user: UserViewModel
  ) {
  };
};

@CommandHandler(CreateBlogsPostCommand)
export class CreateBlogsPostUseCase
  implements ICommandHandler<CreateBlogsPostCommand> {

  constructor(
    protected postsRepository: PostsRepository,
    protected blogsQueryRepository: BlogsQueryRepository,
    protected postsQueryRepository: PostsQueryRepository
  ) {
  };

  async execute(command: CreateBlogsPostCommand) {
    const blog = await this.blogsQueryRepository.getRawBlogSQL(command.blogId);
    console.log(blog);
    if (!blog) throw new NotFoundException();
    if (blog.blogOwnerInfo.userId !== command.user.id)
      throw new ForbiddenException();

    // const postId = await this.postsRepository.createPostSQL(
    //   command.blogId, command.postInput, command.user.id);
    // if (!postId) throw new NotFoundException();

    const post = new Post();
    post.id = uuidv4();
    post.userId = command.user.id;
    post.title = command.postInput.title;
    post.shortDescription = command.postInput.shortDescription;
    post.content = command.postInput.content;
    post.blogId = command.blogId;
    post.createdAt = new Date().toISOString();

    const savePost = await this.postsRepository.savePost(post);

    const newPost = await this.postsQueryRepository.getPostSQL(post.id);
    console.log(newPost);
    if (!newPost) throw new NotFoundException();
    return newPost;
  };
};