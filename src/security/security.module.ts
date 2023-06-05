import { Security, SecuritySchema } from "./dom/security.schema";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SecurityController } from "./api/security.controller";
import { SecurityService } from "./app/security.service";
import { SecurityRepository } from "./inf/security.db.repo";
import { SecurityQueryRepository } from "./inf/security.q.repo";
import { UsersQueryRepository } from "../users/inf/users.q.repo";
import { User, UserSchema } from "../users/dom/users.schema";
import { GetUsersSessionHandler } from "./app/queries/get.users.sessions.uc";
import { CqrsModule } from "@nestjs/cqrs";
import { DeleteNotCurrentSessionUseCase }
  from "./app/use-cases/delete.not.current.session.uc";
import { DeleteCurrentSessionUseCase }
  from "./app/use-cases/delete.current.session.uc";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserSentEmails } from "../users/dom/user.entity.sent.emails";
import { Device } from "./dom/device.entity";

const securityUseCases = [
  DeleteNotCurrentSessionUseCase,
  DeleteCurrentSessionUseCase
];
const securityQueries = [
  GetUsersSessionHandler
];

@Module({
  imports: [
    CqrsModule,
    // MongooseModule.forFeature([
    //   { name: Security.name, schema: SecuritySchema },
    //   { name: User.name, schema: UserSchema }
    // ])
    TypeOrmModule.forFeature([Device])
  ],
  controllers: [SecurityController],
  providers: [
    ...securityUseCases,
    ...securityUseCases,
    ...securityQueries,
    SecurityService,
    SecurityRepository,
    SecurityQueryRepository,
    UsersQueryRepository
  ],
  exports: [SecurityService, SecurityRepository, SecurityQueryRepository]
})

export class SecurityModule {
}