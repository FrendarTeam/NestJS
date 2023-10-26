import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from 'src/common/constants/response.dto';
import { successResponseMessage } from 'src/common/constants/responseMessage';

/**
 * @method POST
 * @route /auth/kakao/callback
 * @description 카카오 소셜로그인
 */
export class KakaoLoginResponseDto extends ResponseDto {
  @ApiProperty({ example: successResponseMessage.KAKAO_LOGIN_SUCCESS })
  message: string;
}
