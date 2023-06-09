import { NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogsRepository } from "../../inf/blogs.db.repo";

export class DeleteSubscribeCommand {
  constructor(public blogId: string, public userId: string) {
  };
};

@CommandHandler(DeleteSubscribeCommand)
export class DeleteSubscribeUseCase
  implements ICommandHandler<DeleteSubscribeCommand> {
  constructor(protected blogsRepository: BlogsRepository) {
  };

  async execute(command: DeleteSubscribeCommand) {
    const subcription = await this.blogsRepository
      .getSubscription(command.blogId, command.userId);

    if (!subcription) throw new NotFoundException();

    subcription.status = "Unsubscribed";

    const saveSubscription = await this.blogsRepository
      .saveSubscription(subcription);

    if (!saveSubscription) throw new NotFoundException();
  };
};