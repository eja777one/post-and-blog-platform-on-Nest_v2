import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { UsersQueryRepository } from "../../../users/inf/users.q.repo";
import { UsersRepository } from "../../../users/inf/users.db.repo";

export class ConfirmEmailCommand {
  constructor(public readonly code: string) {
  };
};

@CommandHandler(ConfirmEmailCommand)
export class ConfirmEmailUseCase
  implements ICommandHandler<ConfirmEmailCommand> {

  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly usersRepository: UsersRepository
  ) {
  };

  async execute(command: ConfirmEmailCommand) {
    const user = await this.usersQueryRepository
      .getUserByConfirmSQL(command.code);

    if (!user || user.userEmailConfirmation.isConfirmed
      || user.userEmailConfirmation.expirationDate < new Date().toISOString()) {
      throw new BadRequestException({
        message: [{ message: `Incorrect code`, field: "code" }]
      });
    }

    // const userEmailConfirm = await this.usersRepository
    //   .getUserEmailConfirm(command.code);
    //
    // userEmailConfirm.isConfirmed = true;
    //
    // const saveUserEmailConfirm = await this.usersRepository
    //   .saveUserEmailConfirmation(userEmailConfirm);
    //
    // if (!saveUserEmailConfirm) throw new NotFoundException();

    const updated = await this.usersRepository.activateUserSQL(user.id);
    if (!updated) throw new NotFoundException();
  };
};