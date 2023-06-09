import { NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogsQueryRepository } from "../../../blogs/inf/blogs.q.repo";
import { BlogsRepository } from "../../../blogs/inf/blogs.db.repo";

export class AddTelegramIdCommand {
  constructor(public text: string, public telegramId: string) {
  };
};

@CommandHandler(AddTelegramIdCommand)
export class AddTelegramIdUseCase
  implements ICommandHandler<AddTelegramIdCommand> {
  constructor(
    protected blogsQueryRepository: BlogsQueryRepository,
    protected blogsRepository: BlogsRepository
  ) {
  };

  async execute(command: AddTelegramIdCommand) {
    if (!command.text || !command.telegramId) return;
    const code = command.text.split("=")[1];
    // console.log(code);
    if (!code) return;

    const subscription = await this.blogsRepository
      .getSubscriptionBySecret(code);

    if (subscription.telegramId) return;

    subscription.telegramId = command.telegramId;

    const saveSubscription = await this.blogsRepository
      .saveSubscription(subscription);

    // if (!saveSubscription) throw new NotFoundException();
  };
};