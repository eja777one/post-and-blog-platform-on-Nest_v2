// import { Injectable, CanActivate, ExecutionContext, UnauthorizedException }
//   from "@nestjs/common";
// import { Request } from "express";
// import { UsersQueryRepository } from "../users/inf/users.q.repo";
// import { jwtService } from "../application/jwt.service";
// import { ConfigService } from "@nestjs/config";
//
//
// @Injectable()
// export class AccessTokenAuthGuard implements CanActivate {
//   constructor(
//     protected usersQueryRepository: UsersQueryRepository,
//     private readonly config: ConfigService,
//   ) {
//   };
//
//   async canActivate(context: ExecutionContext)
//     : Promise<boolean> {
//
//     const req: Request = context.switchToHttp().getRequest();
//
//     if (!req.headers.authorization) throw new UnauthorizedException();
//
//     const token = req.headers.authorization.split(' ')[1];
//
//     const userId = await jwtService.getUserIdByToken(token);
//     if (!userId) throw new UnauthorizedException();
//     const user = await this.usersQueryRepository.getUser(userId.toString());
//     if (!user) throw new UnauthorizedException();
//
//     req.user = user;
//
//     return true;
//   };
// };