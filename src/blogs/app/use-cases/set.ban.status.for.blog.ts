import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SaBanBlogInputModel } from "../../blogs.types";
import { BlogsQueryRepository } from "../../inf/blogs.q.repo";
import { BlogsRepository } from "../../inf/blogs.db.repo";
import { NotFoundException } from "@nestjs/common";

export class SetBanStatusForBlogCommand {
  constructor(public id: string, public banInput: SaBanBlogInputModel) {
  };
};

@CommandHandler(SetBanStatusForBlogCommand)
export class SetBanStatusForBlogUseCase
  implements ICommandHandler<SetBanStatusForBlogCommand> {

  constructor(
    protected blogsQueryRepository: BlogsQueryRepository,
    protected blogsRepository: BlogsRepository
  ) {
  };

  async execute(command: SetBanStatusForBlogCommand) {
    const blog = await this.blogsQueryRepository.getRawBlogSQL(command.id);
    if (blog?.blogBanInfo?.isBanned === command.banInput.isBanned) return;

    const blogBanInfo = await this.blogsRepository.getBlogBanInfo(command.id);

    const banDate = command.banInput.isBanned ? new Date().toISOString() : null;

    blogBanInfo.isBanned = command.banInput.isBanned;
    blogBanInfo.banDate = banDate;

    const saveBlogBanInfo = await this.blogsRepository
      .saveBlogBanInfo(blogBanInfo);

    // const saveBlogBanInfo = await this.blogsRepository
    //   .setBanStatusSQL(command.banInput.isBanned, blog.id);

    if (!saveBlogBanInfo) throw new NotFoundException();
  };
};