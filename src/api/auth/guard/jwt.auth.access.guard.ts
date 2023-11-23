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
    const accessToken = request.headers.accesstoken;

    try {
      if (!accessToken) {
        throw new UnauthorizedException(
          errorResponseMessage.NEED_TO_AUTHENTICATION,
        );
      } else {
        // accessToken이 있는 경우 validate
        request.user = await this.jwtService.verifyAsync(accessToken, {
          secret: process.env.TOKEN_SECRET_KEY,
        });

        return request.user;
      }
    } catch (error: any) {
      if (error.name === 'JsonWebTokenError') {
        error.status = 401;
        error.response = {
          status: 'error',
          message: errorResponseMessage.INVALID_TOKEN,
        };

        console.log(error);
        throw error;
      } else if (error.name === 'TokenExpiredError') {
        error.status = 410;
        error.response = {
          status: 'error',
          message: errorResponseMessage.EXPIRED_TOKEN,
        };

        console.log(error);
        throw error;
      } else {
        error.response = {
          status: 'error',
          message: error.message,
        };

        console.log(error);
        throw error;
      }
    }
  }
}
