import { NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogsRepository } from "../../inf/blogs.db.repo";
import { BlogSubscription } from "../../dom/blog.entity.subscirption";
import { v4 as uuidv4 } from "uuid";

export class SubscribeToBlogCommand {
  constructor(public blogId: string, public userId: string) {
  };
};

@CommandHandler(SubscribeToBlogCommand)
export class SubscribeToBlogUseCase
  implements ICommandHandler<SubscribeToBlogCommand> {
  constructor(protected blogsRepository: BlogsRepository) {
  };

  async execute(command: SubscribeToBlogCommand) {
    const blog = await this.blogsRepository.getBlog(command.blogId);
    if (!blog) throw new NotFoundException();

    const checkSubscription = await this.blogsRepository
      .getSubscription(command.blogId, command.userId);

    if (checkSubscription) {
      checkSubscription.status = "Subscribed";

      const saveSubscription = await this.blogsRepository
        .saveSubscription(checkSubscription);
      if (!saveSubscription) throw new NotFoundException();
    } else {
      const subcription = new BlogSubscription();
      subcription.blogId = blog.id;
      subcription.userId = command.userId;
      subcription.secret = uuidv4();
      subcription.status = "Subscribed";

      const saveSubscription = await this.blogsRepository
        .saveSubscription(subcription);
      if (!saveSubscription) throw new NotFoundException();
    }
  };
};