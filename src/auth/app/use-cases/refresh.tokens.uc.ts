import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { jwtService } from "../../../application/jwt.service";
import { TokensDTO } from "../../../users/users.types";
import { SecurityQueryRepository } from "../../../security/inf/security.q.repo";
import { SecurityRepository } from "../../../security/inf/security.db.repo";
import { add } from "date-fns";

export class RefreshTokensCommand {
  constructor(public readonly refreshToken: string) {
  };
};

@CommandHandler(RefreshTokensCommand)
export class RefreshTokensUseCase
  implements ICommandHandler<RefreshTokensCommand> {

  constructor(
    private readonly securityQueryRepository: SecurityQueryRepository,
    private readonly securityRepository: SecurityRepository
  ) {
  };

  async execute(command: RefreshTokensCommand) {
    const payload = await jwtService.getPayloadRefToken(command.refreshToken);
    if (!payload) throw new UnauthorizedException();

    const tokenMeta = await this.securityQueryRepository
      .getTokenMetaSQL(payload.userId, payload.deviceId);

    if (!tokenMeta || payload.createdAt !== tokenMeta.createdAt)
      throw new UnauthorizedException();

    const newAccessToken = await jwtService.createAccessJwt(payload.userId);

    const createdAt = new Date().toISOString();

    const newRefreshToken = await jwtService.createRefreshJwt(
      payload.userId, payload.deviceId, createdAt);

    const session = await this.securityRepository.getSession(payload.userId,
      payload.deviceId);

    session.createdAt = createdAt;
    session.expiredAt = add(new Date(), { minutes: 60 }).toISOString();

    const saveSession = await this.securityRepository.saveSession(session);
    if (!saveSession) throw new NotFoundException();

    // const updateSession = await this.securityRepository
    //   .updateSessionSQL(tokenMeta.id, createdAt);
    //
    // if (!updateSession) throw new NotFoundException();

    return new TokensDTO(newAccessToken, newRefreshToken);
  };
};