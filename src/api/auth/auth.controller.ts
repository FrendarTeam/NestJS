import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoginKakaoRequestDto } from './dto/kakao-login-req.dto';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { successResponseMessage } from 'src/common/constants/responseMessage';
import { ResultWithoutDataDto } from 'src/common/constants/response.dto';
import { KakaoLoginResponseDto } from './dto/kakao-login-res.dto';
import { InvalidTokenErrorDto } from './dto/error.dto';

@Controller('auth')
@ApiTags('Auth API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login/kakao')
  @ApiOperation({
    summary: '카카오 로그인 API',
    description: `카카오 access token을 받아서 가입 여부를 조회한다.<br> 
    신규가입자의 경우 Auth와 User 테이블에 데이터를 저장한다. <br>
    유저의 accessToken과 refreshToken을 발행하여 cookie에 저장한다. <br>
    refreshToken 테이블에 데이터를 저장한다.`,
  })
  @ApiResponse({
    status: 201,
    description: '카카오 로그인 성공',
    type: KakaoLoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '토큰이 유효하지 않습니다.',
    type: InvalidTokenErrorDto,
  })
  async loginKakao(
    @Body() loginKakaoRequestDto: LoginKakaoRequestDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResultWithoutDataDto> {
    try {
      const userAgentString = req.get('User-Agent');
      const deviceInfo = userAgentString?.match(/\(([^)]+)\)/)[1];

      const userId = await this.authService.loginKakao(
        deviceInfo,
        loginKakaoRequestDto,
      );
      const tokens = await this.authService.makeTokens(userId, deviceInfo);
      this.authService.setCookie(res, tokens);

      const data = { message: successResponseMessage.KAKAO_LOGIN_SUCCESS };
      return data;
    } catch (error: any) {
      throw error;
    }
  }
}
