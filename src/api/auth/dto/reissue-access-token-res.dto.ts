import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from 'src/common/constants/response.dto';
import { successResponseMessage } from 'src/common/constants/responseMessage';

/**
 * @method GET
 * @route /auth/token
 * @description 액세스 토큰 재발행
 */
export class ReissueAccessTokenResultDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    description: 'frendar access token',
  })
  accessToken: string;
}

export class ReissueAccessTokenResponseDto extends ResponseDto {
  @ApiProperty({ example: successResponseMessage.REISSUE_ACCESS_TOKEN_SUCCESS })
  message: string;

  @ApiProperty({ type: ReissueAccessTokenResultDto })
  data: ReissueAccessTokenResultDto;
}
