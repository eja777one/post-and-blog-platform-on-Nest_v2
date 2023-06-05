import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../../../users/app/users.service";
import { AuthService } from "../auth.service";
import { UsersQueryRepository } from "../../../users/inf/users.q.repo";
import { emailManager } from "../../../managers/email.manager";
import { UsersRepository } from "../../../users/inf/users.db.repo";
import { v4 as uuidv4 } from "uuid";
import { UserSentEmails } from "../../../users/dom/user.entity.sent.emails";

export class ResendConfirmCommand {
  constructor(public readonly email: string) {
  };
};

@CommandHandler(ResendConfirmCommand)
export class ResendConfirmUseCase
  implements ICommandHandler<ResendConfirmCommand> {

  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly usersRepository: UsersRepository
  ) {
  };

  async execute(command: ResendConfirmCommand) {
    const error = { message: [{ message: `Incorrect email`, field: "email" }] };

    const user = await this.usersQueryRepository
      .getUserByEmailSQL(command.email);

    if (!user || user.userEmailConfirmation.isConfirmed
      || user.userEmailConfirmation.expirationDate < new Date().toISOString()) {
      throw new BadRequestException(error);
    }

    try {
      const newConfirmationCode = uuidv4();

      await emailManager.sendEmailConfirmation(command.email,
        newConfirmationCode);

      const updated = await this.usersRepository
        .updateConfirmationInfoSQL(user.id, newConfirmationCode);
      if (!updated) throw new BadRequestException();

      // const userEmailConfirm = await this.usersRepository
      //   .getUserEmailConfirmByUser(user.id);
      //
      // userEmailConfirm.confirmationCode = newConfirmationCode;
      //
      // const saveUserEmailConfirm = await this.usersRepository
      //   .saveUserEmailConfirmation(userEmailConfirm);
      //
      // const userSentEmail = new UserSentEmails();
      // userSentEmail.sentDate = new Date().toISOString();
      // userSentEmail.confirmId = newConfirmationCode;
      // userSentEmail.userId = user.id;
      //
      // const saveUserSentEmail = await this.usersRepository
      //   .saveUserSentEmails(userSentEmail);
      //
      // if (!saveUserSentEmail || !saveUserEmailConfirm)
      //   throw new NotFoundException();
    } catch (e) {
      console.log(e);
      throw new BadRequestException(error);
    }
  };
};