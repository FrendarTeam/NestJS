import { CustomRepository } from 'src/common/decorators/typeorm_ex.decorator';
import { Auth } from 'src/entities/Auth.entity';
import { Repository } from 'typeorm';

@CustomRepository(Auth)
export class AuthRepository extends Repository<Auth> {
  async createAuth(snsId: string, provider: string): Promise<Auth> {
    const newAuth = this.create({
      snsId,
      provider,
    });

    await this.save(newAuth);

    return newAuth;
  }

  async findUserIdBySnsId(snsId: string): Promise<number> {
    const auth = await this.findOne({
      select: { users: { id: true } },
      where: { snsId },
      relations: { users: true },
    });

    const result = auth ? auth.users.id : null;
    return result;
  }
}
