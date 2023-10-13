import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from 'src/common/constants/response.dto';
import { successResponseMessage } from 'src/common/constants/responseMessage';

export class UserInfoForKakaoLoginDto {
  @ApiProperty({ example: 1, description: '유저의 id' })
  userId: number;

  @ApiProperty({
    example: 'Macintosh; Intel Mac OS X 10_15_7',
    description: '접속한 기기 정보',
  })
  deviceInfo: string;
}

export class KakaoLoginResponseDto extends ResponseDto {
  @ApiProperty({ example: successResponseMessage.KAKAO_LOGIN_SUCCESS })
  message: string;
}
