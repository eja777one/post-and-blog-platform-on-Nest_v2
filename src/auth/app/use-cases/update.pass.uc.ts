import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersQueryRepository } from "../../../users/inf/users.q.repo";
import { PasswordRecoveryRepository } from "../../../users/inf/pass.rec.db.repo";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { genSalt } from "bcrypt";
import { AuthService } from "../auth.service";
import { UsersRepository } from "../../../users/inf/users.db.repo";

export class UpdatePassCommand {
  constructor(
    public readonly newPassword: string,
    public readonly code: string
  ) {
  };
};

@CommandHandler(UpdatePassCommand)
export class UpdatePassUseCase implements ICommandHandler<UpdatePassCommand> {
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly passwordRecoveryRepository: PasswordRecoveryRepository,
    private readonly authService: AuthService,
    private readonly usersRepository: UsersRepository
  ) {
  };

  async execute(command: UpdatePassCommand) {
    const errObj = {
      message: [{ message: `Incorrect recoveryCode`, field: "recoveryCode" }]
    };

    const passwordData = await this.passwordRecoveryRepository
      .getData(command.code);
    if (!passwordData) throw new BadRequestException(errObj);

    if (new Date(passwordData.expiredAt) < new Date()) {
      await this.passwordRecoveryRepository
        .deletePasswordData(passwordData.userId);

      throw new BadRequestException(errObj);
    }

    const user = await this.usersQueryRepository
      .getUserSQL(passwordData.userId);
    if (!user) throw new BadRequestException(errObj);

    const passwordSalt = await genSalt(10);
    const passwordHash = await this.authService
      ._generateHash(command.newPassword, passwordSalt);

    // const updatePassword = await this.usersRepository
    //   .updatePasswordSQL(user.id, passwordHash, passwordSalt);
    // if (!updatePassword) throw new NotFoundException();

    const userToUpdate = await this.usersRepository.getUser(passwordData.userId);
    userToUpdate.passwordSalt = passwordSalt;
    userToUpdate.passwordHash = passwordHash;

    const saveUser = await this.usersRepository.saveUser(userToUpdate);
    if (!saveUser) throw new NotFoundException();
  };
};