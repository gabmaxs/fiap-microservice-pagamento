import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentModel } from './model/payment.model';
import { PaymentService } from './service/payment.service';
import { OrderModule } from '../order/order.module';
import { PaymentPartnerAdapter } from './adapter/mercado-pago.adapter';
import { PaymentController } from './controller/payment.controller';

@Module({
  imports: [OrderModule, TypeOrmModule.forFeature([PaymentModel])],
  providers: [PaymentService, PaymentPartnerAdapter],
  controllers: [PaymentController],
})
export class PaymentModule {}
