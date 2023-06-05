import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { v4 as uuidv4 } from "uuid";
import { AuthService } from "../auth.service";
import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { jwtService } from "../../../application/jwt.service";
import { SessionDTO } from "../../../security/security.types";
import { TokensDTO } from "../../../users/users.types";
import { UsersQueryRepository } from "../../../users/inf/users.q.repo";
import { SecurityQueryRepository } from "../../../security/inf/security.q.repo";
import { SecurityRepository } from "../../../security/inf/security.db.repo";
import { Device } from "../../../security/dom/device.entity";
import { add } from "date-fns";

export class LoginCommand {
  constructor(
    public readonly loginOrEmail: string,
    public readonly password: string,
    public readonly ip: string,
    public readonly deviceName: string
  ) {
  };
};

@CommandHandler(LoginCommand)
export class LoginUseCase implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly authService: AuthService,
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly securityQueryRepository: SecurityQueryRepository,
    private readonly securityRepository: SecurityRepository
  ) {
  };

  async execute(command: LoginCommand) {
    const user = await this.usersQueryRepository
      .getUserSQL(command.loginOrEmail);

    if (!user || !user.userEmailConfirmation.isConfirmed)
      throw new UnauthorizedException();

    const inputPass = await this.authService
      ._generateHash(command.password, user.passwordSalt);

    if (inputPass !== user.passwordHash) throw new UnauthorizedException();
    if (user.userBanInfo.isBanned) throw new UnauthorizedException();

    // const checkSession = await this.securityQueryRepository
    //   .checkSessionSQL(command.ip, command.deviceName, user.id);
    //
    // if (checkSession) {
    //   if (!deletedSession) throw new NotFoundException();
    // }

    // await this.securityRepository.deleteSessionBeforeLoginSQL(
    //   command.ip, command.deviceName, user.id);

    await this.securityRepository.deleteSessionBeforeLogin(command.ip,
      command.deviceName, user.id);

    const deviceId = uuidv4();
    const createdAt = new Date().toISOString();

    const accessToken = await jwtService.createAccessJwt(user.id);

    const refreshToken = await jwtService
      .createRefreshJwt(user.id, deviceId, createdAt);

    const session = new Device();
    session.userId = user.id;
    session.createdAt = createdAt;
    session.expiredAt = add(new Date(), { minutes: 60 }).toISOString();
    session.deviceId = deviceId;
    session.ip = command.ip;
    session.deviceName = command.deviceName;

    const saveSession = await this.securityRepository.saveSession(session);
    if (!saveSession) throw new NotFoundException();

    // const sessionDTO = new SessionDTO(createdAt, deviceId, command.ip,
    //   command.deviceName, user.id);
    //
    // const addSession = await this.securityRepository
    //   .createSessionSQL(sessionDTO);
    //
    // if (!addSession) throw new NotFoundException();

    return new TokensDTO(accessToken, refreshToken);
  };
};