import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDTO } from '../../order/dto/order.dto';
import { PaymentModel } from '../model/payment.model';
import { OrderService } from '../../order/service/order.service';
import { PaymentPartnerAdapter } from '../adapter/mercado-pago.adapter';
import { PAYMENT_STATUS } from '../consts/payment-status.const';
import { CreatePaymentDTO } from '../dto/create-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentModel)
    private paymentModelRepository: Repository<PaymentModel>,
    private orderService: OrderService,
    private paymentPartnerAdapter: PaymentPartnerAdapter,
  ) {}

  async create(createPaymentDTO: CreatePaymentDTO) {
    const entityManager = this.paymentModelRepository.manager; // Obter o EntityManager

    return entityManager.transaction(async (transactionalEntityManager) => {
      try {
        const createdOrder = await this.orderService
          .setTransaction(transactionalEntityManager)
          .create({
            externalId: createPaymentDTO.externalId,
            total: createPaymentDTO.total,
            status: createPaymentDTO.status,
            itens: JSON.stringify(createPaymentDTO.itens),
          } as CreateOrderDTO);

        const createdPaymentPartner =
          await this.paymentPartnerAdapter.generateQRCode({
            externalId: String(createPaymentDTO.externalId),
            total: createPaymentDTO.total,
            itens: createPaymentDTO.itens,
          });

        await transactionalEntityManager.save(PaymentModel, {
          orderId: createdOrder.id,
          externalId: createdPaymentPartner.externalId,
          total: createdOrder.total,
          status: PAYMENT_STATUS.NOVO,
        });

        return {
          qrCode: createdPaymentPartner.qrCode,
        };
      } catch (e) {
        console.error(e);
        throw e;
      }
    });
  }

  async handlePaymentNotifications(paymentId: number) {
    try {
      const { status, orderExternalId } =
        await this.paymentPartnerAdapter.getPaymentStatusById(paymentId);

      const order = await this.orderService.getByExternalId(orderExternalId);

      const payment = await this.paymentModelRepository.findOneByOrFail({
        orderId: order.id,
      });
      return await this.paymentModelRepository.save({
        ...payment,
        status,
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
