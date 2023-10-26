import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from 'src/common/constants/response.dto';
import { successResponseMessage } from 'src/common/constants/responseMessage';

/**
 * @method PUT
 * @route /user/notification
 * @description 알림 설정 토글
 */
export class UserNotificationToggleResponseDto extends ResponseDto {
  @ApiProperty({
    example: successResponseMessage.NOTIFICATION_TOGGLE_ON_SUCCESS,
  })
  message: string;
}
