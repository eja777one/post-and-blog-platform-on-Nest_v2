import { ConfigModule } from "@nestjs/config";

const configModule = ConfigModule.forRoot({
  envFilePath: [".env.local", ".env"]
});
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./strategies/local.strategy";
import { AtJwtStrategy } from "./strategies/at.jwt.strategy";
import { LoginUseCase } from "./app/use-cases/login.uc";
import { RegistrationUseCase } from "./app/use-cases/create.user.us";
import { ResendConfirmUseCase } from "./app/use-cases/resend.confirmation.uc";
import { RefreshTokensUseCase } from "./app/use-cases/refresh.tokens.uc";
import { DeleteRefTokenUseCase } from "./app/use-cases/delete.refresh.token.uc";
import { SendPassRecCodeUseCase } from "./app/use-cases/send.pass.rec.code";
import { UpdatePassUseCase } from "./app/use-cases/update.pass.uc";
import { BaseAuthUseCase } from "./app/use-cases/base.auth.uc";
import { UsersModule } from "../users/users.module";
import { AuthService } from "./app/auth.service";
import { Security, SecuritySchema } from "../security/dom/security.schema";
import { AuthController } from "./api/auth.controller";
import { SecurityModule } from "../security/security.module";
import { PasswordRecoveryRepository } from "../users/inf/pass.rec.db.repo";
import { ConfirmEmailUseCase } from "./app/use-cases/confirm.email.uc";
import { RtJwtStrategy } from "./strategies/rt.jwt.strategy";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Blog } from "../blogs/dom/blog.entity";
import { BlogOwnerInfo } from "../blogs/dom/blog.entity.owner.info";
import { BlogBanInfo } from "../blogs/dom/blog.entity.ban.info";
import { Comment } from "../comments/dom/comment.entity";
import { CommentLikes } from "../comments/dom/comment.entity.likes";
import { PassRecovery } from "../users/dom/pass.rec.entity";

const Strategies = [LocalStrategy, AtJwtStrategy, RtJwtStrategy];
const CommandHandlers = [
  LoginUseCase,
  RegistrationUseCase,
  ResendConfirmUseCase,
  RefreshTokensUseCase,
  DeleteRefTokenUseCase,
  SendPassRecCodeUseCase,
  UpdatePassUseCase,
  BaseAuthUseCase,
  ConfirmEmailUseCase
];
const Providers = [AuthService, JwtService, PasswordRecoveryRepository];

@Module({
  imports: [
    configModule,
    CqrsModule,
    JwtModule.register({}),
    // EmailModule,
    UsersModule,
    PassportModule,
    SecurityModule,
    // MongooseModule.forFeature([
    //   { name: Security.name, schema: SecuritySchema },
    //   { name: PassRecovery.name, schema: PassRecoverySchema }
    // ]),
    TypeOrmModule.forFeature([PassRecovery]),
  ],
  controllers: [AuthController],
  providers: [...Providers, ...Strategies, ...CommandHandlers],
  exports: [...Providers, ...Strategies, ...CommandHandlers]
})
export class AuthModule {
}
