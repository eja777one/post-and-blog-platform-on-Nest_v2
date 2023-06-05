import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { NotFoundException } from "@nestjs/common";
import { BanUserInputModel } from "../../users.types";
import { UsersRepository } from "../../inf/users.db.repo";
import { UsersQueryRepository } from "../../inf/users.q.repo";
import { CommentsRepository } from "../../../comments/inf/comments.db.repo";
import { PostsRepository } from "../../../posts/inf/posts.db.repo";
import { SecurityRepository } from "../../../security/inf/security.db.repo";
import { BlogsQueryRepository } from "../../../blogs/inf/blogs.q.repo";

export class SetBanStatusCommand {
  constructor(public userId: string, public banInfo: BanUserInputModel) {
  };
};

@CommandHandler(SetBanStatusCommand)
export class SetBanStatusUseCase
  implements ICommandHandler<SetBanStatusCommand> {

  constructor(
    protected usersRepository: UsersRepository,
    protected usersQueryRepository: UsersQueryRepository,
    protected commentsRepository: CommentsRepository,
    protected postsRepository: PostsRepository,
    protected securityRepository: SecurityRepository,
    protected blogsQueryRepository: BlogsQueryRepository
  ) {
  };

  async execute(command: SetBanStatusCommand) {
    const user = await this.usersQueryRepository.getUserSQL(command.userId);
    if (!user) throw new NotFoundException(); // is not exist in swagger

    if (user.userBanInfo.isBanned === command.banInfo.isBanned) return;

    // const setBanStatus = await this.usersRepository.setBanStatusSQL(
    //   command.banInfo.isBanned, command.banInfo.banReason, command.userId);
    // if (!setBanStatus) throw new NotFoundException();

    const banDate = command.banInfo.isBanned ? new Date().toISOString() : null;
    const banReason = command.banInfo.isBanned ? command.banInfo.banReason : null;

    const userBanInfo = await this.usersRepository.getUserBanInfo(user.id);

    userBanInfo.isBanned = command.banInfo.isBanned;
    userBanInfo.banReason = banReason;
    userBanInfo.banDate = banDate;

    const saveUserBanInfo = await this.usersRepository
      .saveUserBanInfo(userBanInfo);
    if (!saveUserBanInfo) throw new NotFoundException();

    await this.securityRepository.deleteAllUsersSessions(command.userId);

    await this.postsRepository.changeBanStatusSQL(
      command.userId, command.banInfo.isBanned);

    await this.commentsRepository.changeBanStatusSQL(
      command.userId, command.banInfo.isBanned);

    return true;
  };
};