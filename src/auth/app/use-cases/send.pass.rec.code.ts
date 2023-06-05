import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { emailManager } from "../../../managers/email.manager";
import { UsersQueryRepository } from "../../../users/inf/users.q.repo";
import { PasswordRecoveryRepository } from "../../../users/inf/pass.rec.db.repo";
import { NotFoundException } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { PassRecovery } from "../../../users/dom/pass.rec.entity";
import { add } from "date-fns";

export class SendPassRecCodeCommand {
  constructor(public readonly email: string) {
  }
};

@CommandHandler(SendPassRecCodeCommand)
export class SendPassRecCodeUseCase
  implements ICommandHandler<SendPassRecCodeCommand> {

  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly passwordRecoveryRepository: PasswordRecoveryRepository
  ) {
  };

  async execute(command: SendPassRecCodeCommand) {
    const user = await this.usersQueryRepository
      .getUserSQL(command.email);
    if (!user) return;

    // const deletedSession = await this.passwordRecoveryRepository
    //   .deletePasswordDataSQL(user.id);

    const deletedSession = await this.passwordRecoveryRepository
      .deletePasswordData(user.id);

    if (!deletedSession) throw new NotFoundException();

    const passRecCode = uuidv4();

    const passInfo = new PassRecovery();
    passInfo.userId = user.id;
    passInfo.passwordRecoveryCode = passRecCode;
    passInfo.createdAt = new Date().toISOString();
    passInfo.expiredAt = add(new Date(), { minutes: 10 }).toISOString();

    const savePassInfo = await this.passwordRecoveryRepository
      .savePassData(passInfo);

    if (!savePassInfo) throw new NotFoundException();

    // const addPasswordData = await this.passwordRecoveryRepository
    //   .addPassDataSQL(user.id, passRecCode);
    // if (!addPasswordData) throw new NotFoundException();

    try {
      await emailManager.sendRecoveryPasswordCode(
        user.email, passRecCode);
    } catch (error) {
      console.log(error);
    }
  };
};