import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersService } from "../../../users/app/users.service";
import { User } from "../../../users/dom/users.schema";
import { AuthService } from "../auth.service";
import { UsersQueryRepository } from "../../../users/inf/users.q.repo";

export class ValidateUserCommand {
  constructor(
    public readonly login: string,
    public readonly password: string) {
  };
};

@CommandHandler(ValidateUserCommand)
export class ValidateUserHandler
  implements ICommandHandler<ValidateUserCommand> {

  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly usersQueryRepository: UsersQueryRepository
  ) {
  };

  async execute({ login, password }: ValidateUserCommand) {
    // const user = await this.usersQueryRepository.getDBUser(login);
    // if (!user) return null;

    // const inputPass = await this.authService
    //   ._generateHash(password, user.accountData.passwordSalt);
    //
    // if (inputPass !== user.accountData.passwordHash) return null;
    //
    // return user;
    return true;
  };
};