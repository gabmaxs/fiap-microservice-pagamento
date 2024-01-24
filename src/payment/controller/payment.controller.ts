import { Controller, Post, Res, Body } from '@nestjs/common';
import { PaymentService } from '../service/payment.service';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/payment')
  async create(@Res() res, @Body() requestBody) {
    const qrCode = await this.paymentService.create(requestBody);
    return res.json(qrCode);
  }
}
