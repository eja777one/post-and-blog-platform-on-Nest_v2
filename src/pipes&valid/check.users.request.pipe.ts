// import { ObjectID } from 'bson';
// import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Req } from '@nestjs/common';
// // import { Observable } from 'rxjs';
// import { Request } from 'express';
// import { UsersQueryRepository } from '../users/users.q.repo';
// import { jwtService } from './jwt.service';
// import { ObjectId } from 'mongoose';
// import { UsersRequestRepository } from 'src/users/users.req.db.repo';

// @Injectable()
// export class AccessTokenAuthGuard implements CanActivate {
//   constructor(protected usersRequestRepository: UsersRequestRepository) { };

//   async canActivate(context: ExecutionContext): Promise<boolean> {

//     const req: Request = context.switchToHttp().getRequest();

//     // if (!req.headers.authorization) throw new UnauthorizedException();

//     // const token = req.headers.authorization.split(' ')[1];

//     // const userId = await jwtService.getUserIdByToken(token);
//     // if (!userId) throw new UnauthorizedException();

//     // const user = await this.usersQueryRepository.getUser(userId.toString());
//     // if (!user) throw new UnauthorizedException();

//     // req.user = user;

//     // return true;

//     const attemtsInterval = 10 * 1000;
//     const currentTime = new Date();
//     const attemptTime = new Date(currentTime.getTime() - attemtsInterval);

//     const userLog = {
//       _id: new ObjectID(),
//       url: req.url,
//       ip: req.ip,
//       createdAt: currentTime
//     };

//     const usersRequests =
//       await this.usersRequestRepository.getLogs(userLog, attemptTime);

//     await this.usersRequestRepository.addLog(userLog);

//     if (usersRequests < 5) return true;
//     else throw new TooMany
//   };
// }
