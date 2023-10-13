import { CustomRepository } from 'src/common/decorators/typeorm_ex.decorator';
import { RefreshToken } from 'src/entities/RefreshToken.entity';
import { Repository } from 'typeorm';

@CustomRepository(RefreshToken)
export class RefreshTokenRepository extends Repository<RefreshToken> {
  async addRefreshToken(
    userId: number,
    deviceInfo: string,
    refreshToken: string,
  ): Promise<void> {
    const newRefreshToken = this.create({
      userId,
      deviceInfo,
      refreshToken,
    });

    await this.save(newRefreshToken);
    return;
  }

  async findOneByUserIdAndDeviceInfo(
    userId: number,
    deviceInfo: string,
  ): Promise<RefreshToken> {
    const result = await this.findOne({
      where: { userId, deviceInfo },
    });

    return result;
  }

  async deleteOneByUserIdAndDeviceInfo(
    userId: number,
    deviceInfo: string,
  ): Promise<void> {
    await this.softDelete({ userId, deviceInfo });

    return;
  }
}
