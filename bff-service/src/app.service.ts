import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  BadGatewayException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { Method } from 'axios';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getAll(
    recipientServiceName: string,
    originalUrl: string,
    method: string,
    body: any,
  ): Promise<any> {
    try {
      const recipientUrl = await this.configService.get(recipientServiceName);

      console.log(recipientUrl);

      if (!recipientUrl) {
        throw new BadGatewayException('Cannot process request');
      }

      const { data } = await this.httpService.axiosRef({
        url: `${recipientUrl}${originalUrl}`,
        method: method as Method,
        ...(Object.keys(body).length > 0 && { data: body }),
      });

      if (method === 'GET') {
        const cachedProducts = await this.cacheManager.get(
          recipientServiceName,
        );

        if (cachedProducts) {
          console.log('From cache', cachedProducts);
          return cachedProducts;
        } else {
          await this.cacheManager.set(recipientServiceName, data);
        }
      }

      return data;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async putToCart(
    recipientServiceName: string,
    originalUrl: string,
    method: string,
    body: any,
  ): Promise<any> {
    try {
      const recipientUrl = await this.configService.get(recipientServiceName);

      console.log(recipientUrl);

      if (!recipientUrl) {
        throw new BadGatewayException('Cannot process request');
      }

      const { data } = await this.httpService.axiosRef({
        url: `${recipientUrl}${originalUrl}`,
        method: method as Method,
        data: body,
      });

      return data;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
