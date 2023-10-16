import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { errorResponseMessage } from 'src/common/constants/responseMessage';

@Injectable()
export class JwtAuthAccessGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.cookies.AccessToken;

    if (!accessToken) {
      throw new UnauthorizedException(
        errorResponseMessage.NEED_TO_AUTHENTICATION,
      );
    }
    try {
      request.user = await this.jwtService.verifyAsync(accessToken, {
        secret: process.env.TOKEN_SECRET_KEY,
      });
    } catch {
      throw new UnauthorizedException(errorResponseMessage.INVALID_TOKEN);
    }
    return request.user;
  }
}
