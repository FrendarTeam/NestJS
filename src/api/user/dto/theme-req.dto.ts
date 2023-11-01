import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { UserThemeTypeArray, UserThemeTypeValues } from '../type/theme.type';

/**
 * @method PUT
 * @route /user/theme
 * @description 메인 테마 변경
 */
export class UpdateUserThemeRequestDto {
  @ApiProperty({
    example: 'white 또는 black',
    description: '유저의 테마 색상 (white 또는 black). default는 white.',
  })
  @IsIn(UserThemeTypeArray)
  themeColor: UserThemeTypeValues;
}
