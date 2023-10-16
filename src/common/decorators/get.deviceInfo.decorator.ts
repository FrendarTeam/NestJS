import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetDeviceInfo = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    const userAgentString = request.get('User-Agent');
    const deviceInfo = userAgentString?.match(/\(([^)]+)\)/)[1];
    return deviceInfo;
  },
);
