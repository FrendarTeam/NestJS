import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from 'src/common/constants/response.dto';
import { successResponseMessage } from 'src/common/constants/responseMessage';

/**
 * @method PUT
 * @route /user/theme
 * @description 메인 테마 변경
 */
export class UpdateUserThemeResponseDto extends ResponseDto {
  @ApiProperty({
    example: successResponseMessage.UPDATE_USER_THEME_SUCCESS,
  })
  message: string;
}
