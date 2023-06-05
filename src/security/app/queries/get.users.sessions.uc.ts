import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { jwtService } from "../../../application/jwt.service";
import { UnauthorizedException } from "@nestjs/common";
import { SecurityQueryRepository } from "../../inf/security.q.repo";

export class GetUsersSessionQuery {
  constructor(public refreshToken: string) {
  };
};

@QueryHandler(GetUsersSessionQuery)
export class GetUsersSessionHandler
  implements IQueryHandler<GetUsersSessionQuery> {

  constructor(
    private readonly securityQueryRepository: SecurityQueryRepository
  ) {
  };

  async execute(query: GetUsersSessionQuery) {
    const payload = await jwtService.getPayloadRefToken(query.refreshToken);
    if (!payload) throw new UnauthorizedException();

    const sessions = await this.securityQueryRepository
      .getUsersSessionsSQL(payload.userId);

    if (!sessions) throw new UnauthorizedException();
    return sessions;
  };
};