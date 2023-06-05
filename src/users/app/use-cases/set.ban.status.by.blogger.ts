import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { BloggerBanUserInputModel } from "../../users.types";
import { UsersRepository } from "../../inf/users.db.repo";
import { UsersQueryRepository } from "../../inf/users.q.repo";
import { BlogsQueryRepository } from "../../../blogs/inf/blogs.q.repo";
import { badBlogBanInfo } from "../../../../test/dataForTests";
import { UserBanInfo } from "../../dom/user.entity.ban.info";
import { UserBlogsBanInfo } from "../../dom/user.entity.blogs.ban.info";

export class SetBanStatusByBloggerCommand {
  constructor(
    public userId: string,
    public banInfo: BloggerBanUserInputModel,
    public bloggerId: string
  ) {
  };
};

@CommandHandler(SetBanStatusByBloggerCommand)
export class SetBanStatusByBloggerUseCase
  implements ICommandHandler<SetBanStatusByBloggerCommand> {

  constructor(
    protected usersRepository: UsersRepository,
    protected usersQueryRepository: UsersQueryRepository,
    protected blogsQueryRepository: BlogsQueryRepository
  ) {
  };

  async execute(command: SetBanStatusByBloggerCommand) {
    const user = await this.usersQueryRepository.getUserSQL(command.userId);

    if (!user) throw new NotFoundException(); // is not exist in swagger
    if (user.userBanInfo.isBanned === true) return;

    const blog = await this.blogsQueryRepository
      .getRawBlogSQL(command.banInfo.blogId);

    if (blog.blogOwnerInfo.userId !== command.bloggerId)
      throw new ForbiddenException();

    // const userBlogBanInfo = await this.usersQueryRepository
    //   .getUserBlogBanInfoSQL(command.userId, command.banInfo.blogId);

    const userBlogsBanInfo = await this.usersRepository
      .getUserBlogBanInfo(command.userId, command.banInfo.blogId);

    if (
      userBlogsBanInfo?.isBanned === command.banInfo.isBanned &&
      userBlogsBanInfo?.banReason === command.banInfo.banReason &&
      userBlogsBanInfo?.blogId === command.banInfo.blogId
    ) return;

    // const config = userBlogBanInfo ? "update" : "add";
    //
    // const isBanned = await this.usersRepository
    //   .setBanStatusByBloggerSQL(config, user.id, command.banInfo);
    //
    // if (!isBanned) return;

    if (!userBlogsBanInfo) {
      const newUserBlogsBanInfo = new UserBlogsBanInfo();
      newUserBlogsBanInfo.isBanned = command.banInfo.isBanned;
      newUserBlogsBanInfo.banReason = command.banInfo.banReason;
      newUserBlogsBanInfo.blogId = command.banInfo.blogId;
      newUserBlogsBanInfo.banDate = new Date().toISOString();
      newUserBlogsBanInfo.userId = command.userId;

      const saveUserBlogBanInfo = await this.usersRepository
        .saveUserBlogsBanInfo(newUserBlogsBanInfo);
      if (!saveUserBlogBanInfo) throw new NotFoundException();
    } else {
      userBlogsBanInfo.isBanned = command.banInfo.isBanned;
      userBlogsBanInfo.banReason = command.banInfo.banReason;
      userBlogsBanInfo.banDate = new Date().toISOString();

      const saveUserBlogBanInfo = await this.usersRepository
        .saveUserBlogsBanInfo(userBlogsBanInfo);
      if (!saveUserBlogBanInfo) throw new NotFoundException();
    }
  };
};