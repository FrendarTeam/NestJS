import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FriendRepository } from './repository/friend.repository';
import { AddFriendRequestDto } from './dto/add-friend-req.dto';
import { UserRepository } from '../user/repository/user.repository';
import { errorResponseMessage } from 'src/common/constants/responseMessage';

@Injectable()
export class FriendService {
  constructor(
    private readonly friendRepository: FriendRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async addFriend(userId: number, addFriendRequestDto: AddFriendRequestDto) {
    try {
      const { code } = addFriendRequestDto;
      const userData = await this.userRepository.getUserByCode(code);

      if (!userData || userData.id === userId) {
        throw new NotFoundException(errorResponseMessage.INVALID_FRIEND_CODE);
      }

      const existedFriendData = await this.friendRepository.getFriends(userId);
      const userIdsOfFriends: number[] = [];
      existedFriendData.map((o) => {
        if (o.fromUserId !== userId) {
          userIdsOfFriends.push(o.fromUserId);
        }

        if (o.toUserId !== userId) {
          userIdsOfFriends.push(o.toUserId);
        }
      });

      if (userIdsOfFriends.includes(userData.id)) {
        throw new ConflictException(errorResponseMessage.ALREADY_ADDED_FRIEND);
      }

      await this.friendRepository.addFriend(userId, userData.id);
      return;
    } catch (error: any) {
      throw error;
    }
  }

  async deleteFriend(userId: number, id: number) {
    try {
      const friendData = await this.friendRepository.getFriendById(id);
      if (
        !friendData ||
        (friendData.fromUserId !== userId && friendData.toUserId !== userId)
      ) {
        throw new NotFoundException(errorResponseMessage.CANT_FIND_FRIEND_ID);
      }

      await this.friendRepository.deleteFriend(id);

      return;
    } catch (error: any) {
      throw error;
    }
  }
}
