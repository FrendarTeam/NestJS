import { CustomRepository } from 'src/common/decorators/typeorm_ex.decorator';
import { In, Repository } from 'typeorm';
import { Friend } from 'src/entities/Friend.entity';

@CustomRepository(Friend)
export class FriendRepository extends Repository<Friend> {
  async addFriend(fromUserId: number, toUserId: number): Promise<void> {
    const newFriend = this.create({ fromUserId, toUserId });

    await this.save(newFriend);
    return;
  }

  async getFriendById(id: number): Promise<Friend> {
    return await this.findOne({
      where: { id },
    });
  }

  async getFriendsByIds(ids: number[]): Promise<Friend[]> {
    return await this.find({
      where: { id: In(ids) },
    });
  }

  async getFriends(userId: number): Promise<Friend[]> {
    return await this.find({
      where: [{ fromUserId: userId }, { toUserId: userId }],
    });
  }

  async getFriendsWithUserData(userId: number): Promise<Friend[]> {
    return await this.find({
      where: [{ fromUserId: userId }, { toUserId: userId }],
      relations: { fromUser: true, toUser: true },
    });
  }

  async deleteFriend(id: number): Promise<void> {
    await this.softDelete({ id });
  }
}
