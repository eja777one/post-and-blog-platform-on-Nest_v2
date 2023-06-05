import { BadRequestException, NotFoundException } from "@nestjs/common";
import { BlogsQueryRepository } from "../../inf/blogs.q.repo";
import { BlogsRepository } from "../../inf/blogs.db.repo";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersQueryRepository } from "../../../users/inf/users.q.repo";
import { makeErorrMessage } from "../../../application/make.error.message";

export class bindBlogWithUserCommand {
  constructor(public blogId: string, public userId: string) {
  };
};

@CommandHandler(bindBlogWithUserCommand)
export class bindBlogWithUserUseCase
  implements ICommandHandler<bindBlogWithUserCommand> {

  constructor(
    protected blogsQueryRepository: BlogsQueryRepository,
    protected blogsRepository: BlogsRepository,
    protected usersQueryRepository: UsersQueryRepository
  ) {
  };

  async execute(command: bindBlogWithUserCommand) {
    const blog = await this.blogsQueryRepository.getRawBlogSQL(command.blogId);
    if (!blog) throw new BadRequestException(
      [makeErorrMessage("blogId")]);

    const user = await this.usersQueryRepository.getUserSQL(command.userId);
    if (!user) throw new BadRequestException(
      [makeErorrMessage("userId")]);

    if (blog.blogOwnerInfo.userId) throw new BadRequestException(
      [makeErorrMessage("blogId")]);

    const blogOwnerInfo = await this.blogsRepository
      .getBlogOwnerInfo(command.blogId);

    blogOwnerInfo.userId = command.userId;

    const saveBlogOwnerInfo = await this.blogsRepository
      .saveBlogOwnerInfo(blogOwnerInfo);

    // const saveBlogOwnerInfo = await this.blogsRepository.bindBlogWithUserSQL(
    //   command.userId, command.blogId);

    if (!saveBlogOwnerInfo) throw new NotFoundException();
  };
};