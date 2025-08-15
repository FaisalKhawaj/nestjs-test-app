import {
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import { Helper } from 'src/utils/helper';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    if (!authHeader) {
      throw new UnauthorizedException('Token is missing');
    }

    const encryptedToken = authHeader.split(' ')[1];
    if (!encryptedToken) {
      throw new HttpException('Token format is invalid', 401);
    }

    try {
      const decrypted = Helper.decrypt(encryptedToken);

      req.headers['authorization'] = `Bearer ${decrypted}`;
    } catch (err) {
      throw new HttpException('Token decryption failed', 401);
    }

    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (info?.name === 'TokenExpiredError') {
      throw new HttpException('Token is expired', 401);
    }
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
