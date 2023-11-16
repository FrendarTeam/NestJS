import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from 'src/common/constants/response.dto';
import { successResponseMessage } from 'src/common/constants/responseMessage';

/**
 * @method POST
 * @route /friend
 * @description 친구 추가
 */
export class AddFriendResponseDto extends ResponseDto {
  @ApiProperty({
    example: successResponseMessage.ADD_FRIEND_SUCCESS,
  })
  message: string;
}
