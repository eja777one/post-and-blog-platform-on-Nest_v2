import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogsQueryRepository } from "../../../blogs/inf/blogs.q.repo";
import { BlogsRepository } from "../../../blogs/inf/blogs.db.repo";
import axios from "axios";

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
    const url = process.env.BASE_URL || "http://localhost:3004";

    await axios.post(url + "/app/echo", {
      message: command.text,
      telegramId: command.telegramId,
      flag: "no flag"
    });

    if (!command.text || !command.telegramId) return;
    const code = command.text.split("=")[1];
    console.log(command.text);
    console.log(code);
    if (!code) return;

    const subscription = await this.blogsRepository
      .getSubscriptionBySecret(code);

    if (!subscription) return;
    let flag = false;

    if (!subscription?.telegramId) {
      await this.blogsRepository.updateSubscriptions(
        subscription.userId, command.telegramId);
      flag = true;
    }
    console.log("subscribed");

    await axios.post(url + "/app/echo", {
      message: command.text,
      telegramId: command.telegramId,
      flag
    });
  };
};