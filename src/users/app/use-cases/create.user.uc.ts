import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { UserDTO, UserInputModel } from "../../users.types";
import { genSalt, hash } from "bcrypt";
import { UsersRepository } from "../../inf/users.db.repo";
import { UsersQueryRepository } from "../../inf/users.q.repo";
import { Users } from "../../dom/users.entity";
import { v4 as uuidv4 } from "uuid";
import { UserEmailConfirmation } from "../../dom/user.entity.email.confirmation";
import { add } from "date-fns";
import { UserBanInfo } from "../../dom/user.entity.ban.info";

export class CreateUserCommand {
  constructor(public body: UserInputModel, public ip: string) {
  };
};

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    protected usersRepository: UsersRepository,
    protected usersQueryRepository: UsersQueryRepository
  ) {
  };

  async execute(command: CreateUserCommand) {
    const isUserExist = await this.usersQueryRepository
      .checkUserSQL(command.body.email, command.body.login);

    if (isUserExist.length > 0) throw new BadRequestException(isUserExist);

    const passwordSalt = await genSalt(10);
    const passwordHash = await hash(command.body.password, passwordSalt);

    // const userDTO = new UserDTO(command.body.login, command.body.email,
    //   passwordHash, passwordSalt, command.ip);

    // const userId = await this.usersRepository.createUserSQL(userDTO);

    const user = new Users();
    user.id = uuidv4();
    user.login = command.body.login;
    user.email = command.body.email;
    user.passwordHash = passwordHash;
    user.passwordSalt = passwordSalt;
    user.createdAt = new Date().toISOString();
    user.registrationIP = command.ip;

    const saveUser = await this.usersRepository.saveUser(user);
    if (!saveUser) throw new NotFoundException();

    const userEmailConfirmation = new UserEmailConfirmation();
    userEmailConfirmation.expirationDate = "none";
    userEmailConfirmation.isConfirmed = true;
    userEmailConfirmation.userId = user.id;

    const saveUserEmailConfirmation = await this.usersRepository
      .saveUserEmailConfirmation(userEmailConfirmation);
    if (!saveUserEmailConfirmation) throw new NotFoundException();

    const userBanInfo = new UserBanInfo();
    userBanInfo.userId = user.id;

    const saveUserBanInfo = await this.usersRepository
      .saveUserBanInfo(userBanInfo);
    if (!saveUserBanInfo) throw new NotFoundException();

    const newUser = await this.usersQueryRepository.getViewUserSQL(user.id);
    if (!newUser) throw new NotFoundException();

    return newUser;
  };
};