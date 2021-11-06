import { Controller, All, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller('products')
export class ProductsController {
  constructor(private readonly appService: AppService) {}

  @All()
  async getAll(@Req() { originalUrl, method }: Request) {
    const [, recipientServiceName] = originalUrl.split('/');

    const response = await this.appService.getAll(
      recipientServiceName,
      originalUrl,
      method,
    );

    console.log(response);

    return response;
  }
}
