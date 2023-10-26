import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from 'src/common/constants/response.dto';
import { successResponseMessage } from 'src/common/constants/responseMessage';

/**
 * @method PUT
 * @route /user
 * @description 유저 정보 수정
 */
export class UpdateUserInfoResponseDto extends ResponseDto {
  @ApiProperty({
    example: successResponseMessage.UPDATE_USER_INFO_SUCCESS,
  })
  message: string;
}
