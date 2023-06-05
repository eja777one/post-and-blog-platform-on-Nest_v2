import {
  ForbiddenException, NotFoundException, UnauthorizedException
} from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { jwtService } from "../../../application/jwt.service";
import { SecurityRepository } from "../../inf/security.db.repo";
import { SecurityQueryRepository } from "../../inf/security.q.repo";

export class DeleteCurrentSessionCommand {
  constructor(public refreshToken: string, public deviceId: string) {
  };
};

@CommandHandler(DeleteCurrentSessionCommand)
export class DeleteCurrentSessionUseCase
  implements ICommandHandler<DeleteCurrentSessionCommand> {

  constructor(
    protected securityRepository: SecurityRepository,
    protected securityQueryRepository: SecurityQueryRepository
  ) {
  };

  async execute(command: DeleteCurrentSessionCommand) {
    const payload = await jwtService.getPayloadRefToken(command.refreshToken);
    if (!payload) throw new UnauthorizedException();

    const getSession = await this.securityQueryRepository
      .getSessionByDeviceIdSQL(command.deviceId);

    if (!getSession) throw new NotFoundException();
    if (getSession.userId !== payload.userId) throw new ForbiddenException();

    // const deleteThisSessions = await this.securityRepository
    //   .deleteThisSessionsSQL(payload.userId, command.deviceId);

    const deleteThisSessions = await this.securityRepository
      .deleteSessionBeforeLogout(payload.userId, command.deviceId);

    if (!deleteThisSessions) throw new NotFoundException();
  };
};