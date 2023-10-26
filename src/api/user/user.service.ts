import { Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { UpdateUserThemeRequestDto } from './dto/theme-req.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserInfo(userId: number) {
    try {
      const userData = await this.userRepository.getUser(userId);

      const result = {
        id: userData.id,
        nickname: userData.nickname,
        profileUrl: userData.profileUrl,
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
