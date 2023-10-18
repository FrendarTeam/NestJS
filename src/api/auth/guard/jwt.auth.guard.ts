import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { errorResponseMessage } from 'src/common/constants/responseMessage';
import { RefreshTokenRepository } from '../repository/refreshToken.repository';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const accessToken = request.cookies.AccessToken;
    const refreshToken = request.cookies.RefreshToken;

    if (!accessToken && !refreshToken) {
      throw new UnauthorizedException(
        errorResponseMessage.NEED_TO_AUTHENTICATION,
      );
    }

    try {
      if (accessToken) {
        // accessToken이 있는 경우 validate
        request.user = await this.jwtService.verifyAsync(accessToken, {
          secret: process.env.TOKEN_SECRET_KEY,
        });
      } else {
        // accessToken이 없는 경우 refreshToken validate 후 accessToken 재발급
        const userInfo = await this.jwtService.verifyAsync(refreshToken, {
          secret: process.env.TOKEN_SECRET_KEY,
        });

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

        const jwtPayload = { userId: userInfo.userId };
        const accessToken: string = await this.jwtService.signAsync(
          jwtPayload,
          {
            expiresIn: parseInt(process.env.TOKEN_ACCESS_EXPIRED_TIME),
          },
        );
        const tokens = { accessToken, refreshToken: null };
        this.authService.setCookie(response, tokens);

        request.user = userInfo;
      }
    } catch (error: any) {
      console.log(error);
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException(errorResponseMessage.INVALID_TOKEN);
      } else {
        throw error;
      }
    }
    return request.user;
  }
}
