import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { BlogsQueryRepository } from "../../inf/blogs.q.repo";
import { BlogsRepository } from "../../inf/blogs.db.repo";
import { BlogInputModel } from "../../blogs.types";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

export class UpdateBlogCommand {
  constructor(
    public id: string,
    public blogInput: BlogInputModel,
    public userId: string
  ) {
  };
};

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(
    protected blogsQueryRepository: BlogsQueryRepository,
    protected blogsRepository: BlogsRepository
  ) {
  };

  async execute(command: UpdateBlogCommand) {
    const blog = await this.blogsQueryRepository.getRawBlogSQL(command.id);

    if (!blog) throw new NotFoundException();
    if (blog.blogOwnerInfo.userId !== command.userId)
      throw new ForbiddenException();

    const blogToUpdate = await this.blogsRepository.getBlog(command.id);
    blogToUpdate.name = command.blogInput.name;
    blogToUpdate.description = command.blogInput.description;
    blogToUpdate.websiteUrl = command.blogInput.websiteUrl;

    const updateBlog = await this.blogsRepository.saveBlog(blogToUpdate);

    // const updateBlog = await this.blogsRepository
    //   .updateBlogSQL(command.blogInput, command.id);

    if (!updateBlog) throw new NotFoundException();
  };
};