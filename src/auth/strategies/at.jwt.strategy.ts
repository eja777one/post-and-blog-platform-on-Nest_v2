import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JWTPayload } from "../../types";
import { UsersQueryRepository } from "../../users/inf/users.q.repo";

@Injectable()
export class AtJwtStrategy
  extends PassportStrategy(Strategy, "jwt-access") {

  constructor(
    private readonly config: ConfigService,
    private readonly usersQueryRepository: UsersQueryRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>("ACCESS_TOKEN_SECRET")
    });
  };

  async validate(payload: JWTPayload) {
    if (!payload.userId) throw new UnauthorizedException();

    const user = await this.usersQueryRepository.getUserSQL(payload.userId);
    if (!user) throw new UnauthorizedException();
    return user;
  };
};