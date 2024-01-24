import { Module } from '@nestjs/common';
import { OrderService } from './service/order.service';
import { OrderModel } from './model/order.model';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([OrderModel])],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
