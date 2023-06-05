import {
  Injectable, CanActivate,
  ExecutionContext, UnauthorizedException
} from '@nestjs/common';
import { Request } from 'express';
import { UsersQueryRepository } from '../users/inf/users.q.repo';

@Injectable()
export class CheckCookieGuard implements CanActivate {
  constructor(protected usersQueryRepository: UsersQueryRepository) { };

  canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest();
    // if (!req.cookies.refreshToken) throw new UnauthorizedException();
    if (!req.headers['cookie']) throw new UnauthorizedException();
    return true;
  };
};