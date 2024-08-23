import {JsonController, Post, UploadedFile, UseBefore, UseInterceptor } from 'routing-controllers';
import { AWSService } from '@services/v1';
import { ResponseSchema } from 'routing-controllers-openapi';


@JsonController('/v1/media', { transformResponse: false })
export class MediaController {

  private readonly awsService = new AWSService();

  @Post('/upload')
  @ResponseSchema(String)
  @UseInterceptor()
  async uploadImage(@UploadedFile('file') file: Express.Multer.File) {
    const mediaUrl = await this.awsService.uploadImage(file);
    return mediaUrl;
  }

}