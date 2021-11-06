import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller('cart')
export class CartController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async putToCart(@Req() { originalUrl, method, body }: Request) {
    const [, recipientServiceName] = originalUrl.split('/');

    const response = await this.appService.putToCart(
      recipientServiceName,
      originalUrl,
      method,
      body,
    );

    console.log(response);

    return response;
  }
}
