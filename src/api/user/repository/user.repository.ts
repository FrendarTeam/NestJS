import { CustomRepository } from 'src/common/decorators/typeorm_ex.decorator';
import { User } from 'src/entities/User.entity';
import { Repository } from 'typeorm';
import { UserThemeTypeValues } from '../type/theme.type';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(
    authId: number,
    nickname: string,
    profileUrl: string,
    birthday: string,
    code: string,
  ): Promise<User> {
    const newUser = this.create({
      authId,
      nickname,
      profileUrl,
      birthday,
      code,
    });

    await this.save(newUser);

    return newUser;
  }

  async getUser(userId: number): Promise<User> {
    return await this.findOne({
      where: { id: userId },
    });
  }

  async getUserProfileUrl(userId: number): Promise<string | null> {
    const userData = await this.findOne({
      select: { id: true, profileUrl: true },
      where: { id: userId },
    });

    return userData.profileUrl;
  }

  async getUserNotification(userId: number): Promise<boolean> {
    const userData = await this.findOne({
      select: { id: true, isNotificationEnabled: true },
      where: { id: userId },
    });

    return userData.isNotificationEnabled;
  }

  async getUserByCode(code: string): Promise<User | null> {
    return await this.findOne({
      select: { id: true },
      where: { code },
    });
  }

  async updateUserInfo(
    userId: number,
    nickname: string,
    birthday: string,
    profileUrl: string,
  ): Promise<void> {
    if (profileUrl) {
      await this.update({ id: userId }, { nickname, birthday, profileUrl });
    } else {
      await this.update({ id: userId }, { nickname, birthday });
    }

    return;
  }

  async updateUserNotification(userId: number, status: boolean): Promise<void> {
    await this.update({ id: userId }, { isNotificationEnabled: !status });

    return;
  }

  async updateUserTheme(
    userId: number,
    themeColor: UserThemeTypeValues,
  ): Promise<void> {
    await this.update({ id: userId }, { themeColor });

    return;
  }
}
