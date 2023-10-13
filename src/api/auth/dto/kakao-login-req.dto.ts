import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * @method POST
 * @route /auth/kakao/callback
 * @description 카카오 소셜로그인
 */
export class LoginKakaoRequestDto {
  @ApiProperty({
    example: 'sZP2lPl1YlRCWwQanOG2CbWC',
    description: 'kakao access token',
  })
  @IsString()
  token: string;
}
