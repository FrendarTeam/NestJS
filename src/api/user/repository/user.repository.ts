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

  async getUserNotification(userId: number): Promise<boolean> {
    const userData = await this.findOne({
      select: { isNotificationEnabled: true },
      where: { id: userId },
    });

    return userData.isNotificationEnabled;
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
