import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { jwtService } from "../../../application/jwt.service";
import { SecurityQueryRepository } from "../../../security/inf/security.q.repo";
import { SecurityRepository } from "../../../security/inf/security.db.repo";

export class DeleteRefTokenCommand {
  constructor(public readonly refreshToken: string) {
  };
};

@CommandHandler(DeleteRefTokenCommand)
export class DeleteRefTokenUseCase
  implements ICommandHandler<DeleteRefTokenCommand> {

  constructor(
    private readonly securityQueryRepository: SecurityQueryRepository,
    private readonly securityRepository: SecurityRepository
  ) {
  };

  async execute(command: DeleteRefTokenCommand) {
    if (!command.refreshToken) throw new UnauthorizedException();

    const expiredPayload = await jwtService
      .getExpiredPayloadRefToken(command.refreshToken);

    const tokenMeta = await this.securityQueryRepository
      .getTokenMetaSQL(expiredPayload.userId, expiredPayload.deviceId);

    if (!tokenMeta || expiredPayload.createdAt !== tokenMeta.createdAt)
      throw new UnauthorizedException();

    // const deleted = await this.securityRepository.deleteSessionBeforeLogoutSQL(
    //   expiredPayload.userId, expiredPayload.deviceId);

    const deleted = await this.securityRepository.deleteSessionBeforeLogout(
      expiredPayload.userId, expiredPayload.deviceId);

    if (!deleted) throw new NotFoundException();

    const payload = await jwtService.getPayloadRefToken(command.refreshToken);

    if (!payload) throw new UnauthorizedException();
  };
};