import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from 'src/common/constants/response.dto';
import { successResponseMessage } from 'src/common/constants/responseMessage';

/**
 * @method GET
 * @route /friend
 * @description 친구 목록 조회
 */
export class UserInfoForFriendListDto {
  @ApiProperty({ example: 1, description: '유저의 id' })
  id: number;

  @ApiProperty({ example: 2, description: 'friend id' })
  friendId: number;

  @ApiProperty({ example: 'sumin', description: '유저의 닉네임' })
  nickname: string;

  @ApiProperty({
    example: 'https://www.profileUrl.com',
    description: '유저의 프로필 url',
    nullable: true,
  })
  profileUrl: string;
}

export class GetListOfFriendResultDto {
  @ApiProperty({ type: [UserInfoForFriendListDto] })
  friends: UserInfoForFriendListDto[];
}

export class GetListOfFriendResponseDto extends ResponseDto {
  @ApiProperty({ example: successResponseMessage.GET_LIST_OF_FRIEND_SUCCESS })
  message: string;

  @ApiProperty({ type: GetListOfFriendResultDto })
  data: GetListOfFriendResultDto;
}
