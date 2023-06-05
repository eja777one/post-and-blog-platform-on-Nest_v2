import { NotFoundException } from "@nestjs/common";
import { BlogsQueryRepository } from "../../inf/blogs.q.repo";
import { BlogsRepository } from "../../inf/blogs.db.repo";
import { BlogInputModel } from "../../blogs.types";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogBanInfo } from "../../dom/blog.entity.ban.info";
import { BlogOwnerInfo } from "../../dom/blog.entity.owner.info";
import { Blog } from "../../dom/blog.entity";
import { v4 as uuidv4 } from "uuid";

export class CreateTestBlogCommand {
  constructor(public blogInput: BlogInputModel) {
  };
};

@CommandHandler(CreateTestBlogCommand)
export class CreateTestBlogUseCase
  implements ICommandHandler<CreateTestBlogCommand> {

  constructor(
    protected blogsQueryRepository: BlogsQueryRepository,
    protected blogsRepository: BlogsRepository
  ) {
  };

  async execute(command: CreateTestBlogCommand) {
    // const blogId = await this.blogsRepository
    //   .createBlogSQL(command.blogInput);

    const blogId = uuidv4();

    const blogBanInfo = new BlogBanInfo();
    blogBanInfo.blogId = blogId;

    const blogOwnerInfo = new BlogOwnerInfo();
    blogOwnerInfo.blogId = blogId;

    const blog = new Blog();
    blog.id = blogId;
    blog.name = command.blogInput.name;
    blog.description = command.blogInput.description;
    blog.websiteUrl = command.blogInput.websiteUrl;
    blog.createdAt = new Date().toISOString();

    const saveBlog = await this.blogsRepository.saveBlog(blog);
    const saveBlogBanInfo = await this.blogsRepository
      .saveBlogBanInfo(blogBanInfo);
    const saveBlogOwnerInfo = await this.blogsRepository
      .saveBlogOwnerInfo(blogOwnerInfo);

    if (!saveBlog || !saveBlogBanInfo || !saveBlogOwnerInfo)
      throw new NotFoundException();

    const newBlog = await this.blogsQueryRepository.getBlogSQL(blogId);
    if (!newBlog) throw new NotFoundException();

    return newBlog;
  };
};