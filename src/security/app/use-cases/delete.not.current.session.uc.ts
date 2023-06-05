import { UnauthorizedException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { jwtService } from "../../../application/jwt.service";
import { SecurityRepository } from "../../inf/security.db.repo";

export class DeleteNotCurrentSessionCommand {
  constructor(public refreshToken: string) {
  };
};

@CommandHandler(DeleteNotCurrentSessionCommand)
export class DeleteNotCurrentSessionUseCase
  implements ICommandHandler<DeleteNotCurrentSessionCommand> {

  constructor(protected securityRepository: SecurityRepository) {
  };

  async execute(command: DeleteNotCurrentSessionCommand) {
    const payload = await jwtService.getPayloadRefToken(command.refreshToken);
    if (!payload) throw new UnauthorizedException();

    // const deletedSessions = await this.securityRepository
    //   .deleteOtherSessionsSQL(payload.userId, payload.deviceId);

    const deletedSessions = await this.securityRepository
      .deleteOtherSessions(payload.userId, payload.deviceId);

    if (!deletedSessions) throw new UnauthorizedException();
  };
};