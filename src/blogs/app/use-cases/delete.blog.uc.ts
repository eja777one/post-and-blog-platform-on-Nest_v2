import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogsQueryRepository } from "../../inf/blogs.q.repo";
import { BlogsRepository } from "../../inf/blogs.db.repo";
import { S3StorageAdapter } from "../../../adapters/files.storage.adapter";

export class DeleteBlogCommand {
  constructor(public id: string, public userId: string) {
  };
};

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand> {
  constructor(
    protected blogsQueryRepository: BlogsQueryRepository,
    protected blogsRepository: BlogsRepository,
    private fileStorageAdapter: S3StorageAdapter
  ) {
  };

  async execute(command: DeleteBlogCommand) {
    const blog = await this.blogsQueryRepository.getRawBlogSQL(command.id);
    if (!blog) throw new NotFoundException();
    if (blog.blogOwnerInfo.userId !== command.userId)
      throw new ForbiddenException();

    const deleteObjects = await this.fileStorageAdapter
      .deleteBlogFiles(blog.id);

    if (!deleteObjects) throw new NotFoundException();

    const deleted = await this.blogsRepository.deleteBlog(command.id);
    if (!deleted) throw new NotFoundException();
  };
};