import * as path from 'path';
import * as AWS from 'aws-sdk';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class S3Service {
  private readonly awsS3: AWS.S3;
  public readonly S3_BUCKET_NAME: string;

  constructor() {
    this.awsS3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    this.S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
  }

  async uploadFileToS3(file: Express.Multer.File): Promise<string> {
    try {
      const key = `profile/${Date.now()}_${path.basename(
        file.originalname,
      )}`.replace(/ /g, '_');

      await this.awsS3
        .putObject({
          Bucket: this.S3_BUCKET_NAME,
          Key: key,
          Body: file.buffer,
          ACL: 'public-read',
          ContentType: file.mimetype,
        })
        .promise();
      return key;
    } catch (error) {
      throw new BadRequestException(`Image upload failed : ${error}`);
    }
  }

  async deleteS3Object(
    key: string,
    callback?: (err: AWS.AWSError, data: AWS.S3.DeleteObjectOutput) => void,
  ): Promise<void> {
    try {
      await this.awsS3
        .deleteObject(
          {
            Bucket: this.S3_BUCKET_NAME,
            Key: key,
          },
          callback,
        )
        .promise();
      return;
    } catch (error) {
      throw new BadRequestException(`Failed to delete image : ${error}`);
    }
  }
}
