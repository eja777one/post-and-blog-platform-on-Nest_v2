import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { genSalt } from "bcrypt";
import { AuthService } from "../auth.service";
import { UserDTO, UserInputModel } from "../../../users/users.types";
import { UsersQueryRepository } from "../../../users/inf/users.q.repo";
import { emailManager } from "../../../managers/email.manager";
import { UsersRepository } from "../../../users/inf/users.db.repo";
import { Users } from "../../../users/dom/users.entity";
import { v4 as uuidv4 } from "uuid";
import { UserEmailConfirmation } from "../../../users/dom/user.entity.email.confirmation";
import { add } from "date-fns";
import { UserBanInfo } from "../../../users/dom/user.entity.ban.info";
import { UserSentEmails } from "../../../users/dom/user.entity.sent.emails";

export class RegistrationCommand {
  constructor(
    public readonly body: UserInputModel,
    public readonly ip: string
  ) {
  };
};

@CommandHandler(RegistrationCommand)
export class RegistrationUseCase
  implements ICommandHandler<RegistrationCommand> {

  constructor(
    private readonly authService: AuthService,
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly usersRepository: UsersRepository
  ) {
  };

  async execute(command: RegistrationCommand) {
    const isLoginOrEmailExist = await this.usersQueryRepository
      .checkUserSQL(command.body.email, command.body.login);

    if (isLoginOrEmailExist.length > 0)
      throw new BadRequestException(isLoginOrEmailExist);

    const passwordSalt = await genSalt(10);
    const passwordHash = await this.authService
      ._generateHash(command.body.password, passwordSalt);

    // const userDTO = new UserDTO(command.body.login, command.body.email,
    //   passwordHash, passwordSalt, command.ip);

    // const { userId, confirmationCode } = await this.usersRepository
    //   .registrateUserSQL(userDTO);

    const userId = uuidv4();
    const confirmCode = uuidv4();

    const user = new Users();
    user.id = userId;
    user.login = command.body.login;
    user.email = command.body.email;
    user.passwordHash = passwordHash;
    user.passwordSalt = passwordSalt;
    user.createdAt = new Date().toISOString();
    user.registrationIP = command.ip;

    const saveUser = await this.usersRepository.saveUser(user);
    if (!saveUser) throw new NotFoundException();

    const userEmailConfirmation = new UserEmailConfirmation();
    userEmailConfirmation.expirationDate = add(new Date(),
      { hours: 24 }).toISOString();
    userEmailConfirmation.confirmationCode = confirmCode;
    userEmailConfirmation.userId = userId;

    const saveUserEmailConfirmation = await this.usersRepository
      .saveUserEmailConfirmation(userEmailConfirmation);
    if (!saveUserEmailConfirmation) throw new NotFoundException();

    const userBanInfo = new UserBanInfo();
    userBanInfo.userId = userId;

    const saveUserBanInfo = await this.usersRepository
      .saveUserBanInfo(userBanInfo);
    if (!saveUserBanInfo) throw new NotFoundException();

    const userSentEmails = new UserSentEmails();
    userSentEmails.sentDate = new Date().toISOString();
    userSentEmails.confirmId = confirmCode;
    userSentEmails.userId = userId;

    const saveUserSentEmails = await this.usersRepository
      .saveUserSentEmails(userSentEmails);
    if (!saveUserSentEmails) throw new NotFoundException();

    try {
      await emailManager.sendEmailConfirmation(
        command.body.email, confirmCode);
    } catch (error) {
      console.error(error);
      await this.usersRepository.deleteUser(userId);
      throw new BadRequestException({
        message: [{ message: `Incorrect email`, field: "email" }]
      });
    }
  };
};