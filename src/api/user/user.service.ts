import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { UpdateUserThemeRequestDto } from './dto/theme-req.dto';
import { UpdateUserInfoRequestDto } from './dto/update-user-req.dto';
import { S3Service } from './s3/s3.service';
import { errorResponseMessage } from 'src/common/constants/responseMessage';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly s3Service: S3Service,
  ) {}

  async getUserInfo(userId: number) {
    try {
      const userData = await this.userRepository.getUser(userId);

      let profileUrl = userData.profileUrl;
      if (!profileUrl) {
        profileUrl = process.env.AWS_S3_DEFAULT_KEY;
      }

      if (!profileUrl.includes('kakaocdn')) {
        profileUrl = process.env.AWS_S3_URI + profileUrl;
      }

      const result = {
        id: userData.id,
        nickname: userData.nickname,
        profileUrl,
        isNotificationEnabled: userData.isNotificationEnabled,
        themeColor: userData.themeColor,
        code: userData.code,
      };

      return result;
    } catch (error: any) {
      throw error;
    }
  }

  async updateUserInfo(
    userId: number,
    image: Express.Multer.File,
    updateUserInfoRequestDto: UpdateUserInfoRequestDto,
  ) {
    try {
      let { nickname, birthday } = updateUserInfoRequestDto;
      let profileUrl: string = null;

      if (!nickname || !birthday) {
        throw new BadRequestException(errorResponseMessage.NULL_VALUE);
      }

      /**
       * 수정하려는 유저 정보에 image data가 있으면
       * s3에 파일 key 업로드 -> 기존 유저 정보의 profileUrl 조회 -> 카카오 데이터가 아닐 경우 s3에서 기존 파일 key는 삭제
       */
      if (image) {
        profileUrl = await this.s3Service.uploadFileToS3(image);
        const existedProfileUrl =
          await this.userRepository.getUserProfileUrl(userId);
        if (existedProfileUrl && !existedProfileUrl.includes('kakaocdn')) {
          await this.s3Service.deleteS3Object(existedProfileUrl);
        }
      }

      /**
       * profileUrl이 null이면 nickname과 birthday만 업데이트
       */
      await this.userRepository.updateUserInfo(
        userId,
        nickname,
        birthday,
        profileUrl,
      );

      /**
       * 업데이트 후 유저 정보 반환
       */
      const userData = await this.userRepository.getUser(userId);

      profileUrl = userData.profileUrl;
      if (!profileUrl) {
        profileUrl = process.env.AWS_S3_DEFAULT_KEY;
      }

      if (!profileUrl.includes('kakaocdn')) {
        profileUrl = process.env.AWS_S3_URI + profileUrl;
      }

      const result = {
        id: userData.id,
        nickname: userData.nickname,
        profileUrl,
        isNotificationEnabled: userData.isNotificationEnabled,
        themeColor: userData.themeColor,
        code: userData.code,
      };

      return result;
    } catch (error: any) {
      throw error;
    }
  }

  async notificationToggle(userId: number) {
    try {
      const status = await this.userRepository.getUserNotification(userId);

      await this.userRepository.updateUserNotification(userId, status);

      return !status;
    } catch (error: any) {
      throw error;
    }
  }

  async updateUserTheme(
    userId: number,
    updateUserThemeRequestDto: UpdateUserThemeRequestDto,
  ) {
    try {
      const { themeColor } = updateUserThemeRequestDto;

      await this.userRepository.updateUserTheme(userId, themeColor);

      return;
    } catch (error: any) {
      throw error;
    }
  }
}
