import { Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';

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
}
