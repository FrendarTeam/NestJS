import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from 'src/common/constants/response.dto';
import { successResponseMessage } from 'src/common/constants/responseMessage';

/**
 * @method PUT
 * @route /user
 * @description 유저 정보 수정
 */
export class UserInfoDto {
  @ApiProperty({ example: '1', description: '유저의 id' })
  id: number;

  @ApiProperty({ example: 'sumin', description: '유저의 닉네임' })
  nickname: string;

  @ApiProperty({
    example: 'https://www.profileUrl.com',
    description: '유저의 프로필 url',
    nullable: true,
  })
  profileUrl: string;

  @ApiProperty({ example: true, description: '알림 허용 여부' })
  isNotificationEnabled: boolean;

  @ApiProperty({
    example: 'white',
    description: '유저의 테마 색상. default는 white.',
  })
  themeColor: string;

  @ApiProperty({ example: 'imec86', description: '유저의 친구 코드' })
  code: string;
}

export class UpdateUserInfoResultDto {
  @ApiProperty({ type: UserInfoDto })
  user: UserInfoDto;
}

export class UpdateUserInfoResponseDto extends ResponseDto {
  @ApiProperty({
    example: successResponseMessage.UPDATE_USER_INFO_SUCCESS,
  })
  message: string;

  @ApiProperty({ type: UpdateUserInfoResultDto })
  data: UpdateUserInfoResultDto;
}
