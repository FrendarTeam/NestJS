import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';
import { UserThemeTypeArray, UserThemeTypeValues } from '../type/theme.type';

/**
 * @method PUT
 * @route /user
 * @description 유저 정보 수정
 */
export class UpdateUserInfoRequestDto {
  @ApiProperty({ example: 'sumin', description: '유저의 닉네임' })
  @IsString()
  nickname: string;

  @ApiProperty({ example: '1021', description: '유저의 생일' })
  @IsString()
  birthday: string;

  @ApiProperty({
    example: 'https://www.profileUrl.com',
    description: '유저의 프로필 url',
  })
  @IsString()
  profileUrl: string;
}
