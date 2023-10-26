import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from 'src/common/constants/response.dto';
import { successResponseMessage } from 'src/common/constants/responseMessage';

/**
 * @method POST
 * @route /auth/logout
 * @description 로그아웃
 */
export class LogoutResponseDto extends ResponseDto {
  @ApiProperty({ example: successResponseMessage.LOGOUT_SUCCESS })
  message: string;
}
