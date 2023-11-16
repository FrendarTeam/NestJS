import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from 'src/common/constants/response.dto';
import { successResponseMessage } from 'src/common/constants/responseMessage';

/**
 * @method DELETE
 * @route /friend?id=
 * @description 친구 삭제
 */
export class DeleteFriendResponseDto extends ResponseDto {
  @ApiProperty({
    example: successResponseMessage.DELETE_FRIEND_SUCCESS,
  })
  message: string;
}
