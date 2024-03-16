import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './database/database.config';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [OrderModule, PaymentModule, KafkaModule, TypeOrmModule.forRoot(config)],
  controllers: [AppController],
})
export class AppModule {}
