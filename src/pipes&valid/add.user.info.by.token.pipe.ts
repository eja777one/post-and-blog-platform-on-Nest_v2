import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UsersQueryRepository } from '../users/inf/users.q.repo';
import { jwtService } from '../application/jwt.service';

@Injectable()
export class AddUserInfoGuard implements CanActivate {
  constructor(protected usersQueryRepository: UsersQueryRepository) { };

  async canActivate(context: ExecutionContext)
    : Promise<boolean> {

    const req: Request = context.switchToHttp().getRequest();

    if (!req.headers.authorization) return true;

    const token = req.headers.authorization.split(' ')[1];

    const userId = await jwtService.getUserIdByToken(token);
    if (!userId) return true;

    const user = await this.usersQueryRepository.getViewUserSQL(userId);
    if (!user) return true;

    req.user = user;
    return true;
  };
};