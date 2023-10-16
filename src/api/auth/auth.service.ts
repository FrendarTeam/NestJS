import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginKakaoRequestDto } from './dto/kakao-login-req.dto';
import axios from 'axios';
import { errorResponseMessage } from 'src/common/constants/responseMessage';
import { AuthRepository } from './repository/auth.repository';
import { DataSource } from 'typeorm';
import { UserRepository } from '../user/repository/user.repository';
import { RefreshTokenRepository } from './repository/refreshToken.repository';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private dataSource: DataSource,
    private jwtService: JwtService,
  ) {}

  async loginKakao(
    deviceInfo: string,
    loginKakaoRequestDto: LoginKakaoRequestDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { token } = loginKakaoRequestDto;

      /**
       * 1. 카카오 API: 사용자 정보 가져오기
       *    - 클라이언트로부터 받은 카카오 access token을 이용해 카카오서버 사용자 정보 조회
       *    - 유효하지 않은 토큰일 경우 401 error response
       */
      const userInfo = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      /**
       * 2. Auth 테이블에서 동일한 snsId 조회
       *    - 존재하지 않는 snsId일 경우 auth와 user 테이블에 data insert (신규가입)
       *    - 가입한 적 있는 snsId일 경우 refreshToken table에서 deviceInfo와 userId가 동일한 데이터 조회 후 soft delete
       */
      const snsId: string = userInfo.data.id;
      let userId = await this.authRepository.findUserIdBySnsId(snsId);

      if (!userId) {
        const provider = 'kakao';
        const newAuth = await queryRunner.manager
          .withRepository(this.authRepository)
          .createAuth(snsId, provider);

        const authId = newAuth.id;
        const kakaoData = userInfo.data.kakao_account;
        const nickname = kakaoData.profile.nickname;
        const profileURL = kakaoData.profile_image_needs_agreement
          ? kakaoData.profile_image_url
          : null;
        const birthday = kakaoData.birthday_needs_agreement
          ? kakaoData.birthday
          : null;
        const code = Math.random().toString(36).slice(-5) + authId.toString();

        const newUser = await queryRunner.manager
          .withRepository(this.userRepository)
          .createUser(authId, nickname, profileURL, birthday, code);

        userId = newUser.id;
      } else {
        const isExistedRefreshToken =
          await this.refreshTokenRepository.findOneByUserIdAndDeviceInfo(
            userId,
            deviceInfo,
          );

        if (isExistedRefreshToken) {
          await queryRunner.manager
            .withRepository(this.refreshTokenRepository)
            .deleteOneByUserIdAndDeviceInfo(userId, deviceInfo);
        }
      }

      await queryRunner.commitTransaction();
      return userId;
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      if (axios.isAxiosError(error)) {
        if (error.response.status === 401) {
          throw new UnauthorizedException(errorResponseMessage.INVALID_TOKEN);
        } else {
          throw new InternalServerErrorException();
        }
      } else {
        throw error;
      }
    } finally {
      await queryRunner.release();
    }
  }

  async makeTokens(userId: number, deviceInfo: string) {
    try {
      /**
       * 1. userId를 넣은 Access Token과 Refresh Token 발급
       */
      const jwtPayload = { userId };

      const accessToken: string = await this.jwtService.signAsync(jwtPayload, {
        expiresIn: parseInt(process.env.TOKEN_ACCESS_EXPIRED_TIME),
      });
      const refreshToken: string = await this.jwtService.signAsync(jwtPayload, {
        expiresIn: parseInt(process.env.TOKEN_REFRESH_EXPIRED_TIME),
      });

      /**
       * 2. RefreshToken 테이블에 data insert
       */
      await this.refreshTokenRepository.addRefreshToken(
        userId,
        deviceInfo,
        refreshToken,
      );

      return { accessToken, refreshToken };
    } catch (error: any) {
      throw error;
    }
  }

  setCookie(
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    try {
      const { accessToken, refreshToken } = tokens;

      if (accessToken) {
        res.cookie('AccessToken', accessToken, {
          // 1시간
          maxAge: parseInt(process.env.TOKEN_ACCESS_EXPIRED_TIME),
          httpOnly: true,
          sameSite: process.env.NODE_ENV === 'local' ? 'lax' : 'none',
          secure: process.env.NODE_ENV !== 'local',
        });
      }

      if (refreshToken) {
        res.cookie('RefreshToken', refreshToken, {
          // 7일
          maxAge: parseInt(process.env.TOKEN_REFRESH_EXPIRED_TIME),
          httpOnly: true,
          sameSite: process.env.NODE_ENV === 'local' ? 'lax' : 'none',
          secure: process.env.NODE_ENV !== 'local',
        });
      }
    } catch (error: any) {
      throw error;
    }
  }

  async deleteRefreshToken(userId: number, deviceInfo: string) {
    try {
      await this.refreshTokenRepository.deleteOneByUserIdAndDeviceInfo(
        userId,
        deviceInfo,
      );

      return;
    } catch (error: any) {
      throw error;
    }
  }
}
