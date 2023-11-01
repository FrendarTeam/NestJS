import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { errorResponseMessage } from 'src/common/constants/responseMessage';
import { RefreshTokenRepository } from '../repository/refreshToken.repository';

@Injectable()
export class JwtAuthRefreshGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies.RefreshToken;

    try {
      if (!refreshToken) {
        throw new UnauthorizedException(
          errorResponseMessage.NEED_TO_AUTHENTICATION,
        );
      } else {
        // RefreshToken이 있는 경우 validate
        const userInfo = await this.jwtService.verifyAsync(refreshToken, {
          secret: process.env.TOKEN_SECRET_KEY,
        });

        // refreshToken 테이블의 deviceInfo, refreshToken 데이터가 일치하는지 조회
        const deviceInfo = request.get('User-Agent')?.match(/\(([^)]+)\)/)[1];
        const isExistedRefreshToken =
          await this.refreshTokenRepository.findOneByUserIdAndDeviceInfoAndRefreshToken(
            userInfo.userId,
            deviceInfo,
            refreshToken,
          );

        if (!isExistedRefreshToken) {
          throw new UnauthorizedException(
            errorResponseMessage.NEED_TO_AUTHENTICATION,
          );
        }

        request.user = userInfo;
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
