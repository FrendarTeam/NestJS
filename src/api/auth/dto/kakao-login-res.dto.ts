import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from 'src/common/constants/response.dto';
import { successResponseMessage } from 'src/common/constants/responseMessage';

export class KakaoLoginResponseDto extends ResponseDto {
  @ApiProperty({ example: successResponseMessage.KAKAO_LOGIN_SUCCESS })
  message: string;
}
