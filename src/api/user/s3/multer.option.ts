import { BadRequestException } from '@nestjs/common';
import { errorResponseMessage } from 'src/common/constants/responseMessage';

export const multerOptions = {
  fileFilter: (request, file, callback) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      callback(null, true);
    } else {
      callback(
        new BadRequestException(errorResponseMessage.INVALID_IMAGE_FILE),
        false,
      );
    }
  },
};
