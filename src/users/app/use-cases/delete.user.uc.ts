import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { NotFoundException } from "@nestjs/common";
import { UsersRepository } from "../../inf/users.db.repo";
import { UsersQueryRepository } from "../../inf/users.q.repo";

export class DeleteUserCommand {
  constructor(public id: string) {
  };
};

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand> {
  constructor(
    protected usersRepository: UsersRepository,
    protected usersQueryRepository: UsersQueryRepository
  ) {
  };

  async execute(command: DeleteUserCommand) {
    const user = await this.usersQueryRepository.getUserSQL(command.id);
    if (!user) throw new NotFoundException();

    const deleted = await this.usersRepository.deleteUser(command.id);
    if (!deleted) throw new NotFoundException();
  };
};