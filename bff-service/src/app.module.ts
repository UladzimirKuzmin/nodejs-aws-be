import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ProductsController } from './products.controller';
import { CartController } from './cart.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({ ttl: 120 }),
    HttpModule,
  ],
  controllers: [CartController, ProductsController],
  providers: [AppService],
})
export class AppModule {}
