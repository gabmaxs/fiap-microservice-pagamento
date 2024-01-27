import {
  Controller,
  Post,
  Res,
  Body,
  Query,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { PaymentService } from '../service/payment.service';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/payment')
  async create(@Res() res, @Body() requestBody) {
    const qrCode = await this.paymentService.create(requestBody);
    return res.json(qrCode);
  }

  @Post('/notification')
  async handleNotification(
    @Res() res,
    @Query('id') idItem,
    @Query('topic') topic,
  ) {
    if (topic === 'payment') {
      return res
        .status(HttpStatus.OK)
        .json(await this.paymentService.handlePaymentNotifications(idItem));
    }

    throw new NotFoundException('Handler de topico nao implementado');
  }
}
