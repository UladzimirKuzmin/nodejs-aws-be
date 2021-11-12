import { Controller, All, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller('/*')
export class ProductsController {
  constructor(private readonly appService: AppService) {}

  @All()
  async getAll(@Req() { originalUrl, method, body }: Request) {
    const [, recipientServiceName] = originalUrl.split('/');

    const response = await this.appService.getAll(
      recipientServiceName,
      originalUrl,
      method,
      body,
    );

    console.log(response);

    return response;
  }
}
