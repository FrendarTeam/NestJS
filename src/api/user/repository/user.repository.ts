import { CustomRepository } from 'src/common/decorators/typeorm_ex.decorator';
import { User } from 'src/entities/User.entity';
import { Repository } from 'typeorm';

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
    return this.findOne({
      where: { id: userId },
    });
  }
}
