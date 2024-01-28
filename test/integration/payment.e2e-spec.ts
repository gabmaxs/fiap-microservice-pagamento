import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PaymentPartnerAdapter } from '../../src/payment/adapter/mercado-pago.adapter';
import { PAYMENT_STATUS } from '../../src/payment/consts/payment-status.const';

describe('PaymentController (e2e)', () => {
  let app: INestApplication;
  const externaiId = 789010101;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/payment (POST)', async () => {
    const order = {
      externalId: externaiId,
      total: 3,
      itens: [
        {
          name: 'Item 1',
          amount: 2,
          price: 1,
        },
        {
          name: 'Item 2',
          amount: 1,
          price: 1,
        },
      ],
      status: 0,
    };

    const response = await request(app.getHttpServer())
      .post('/payment')
      .send(order)
      .expect(201);

    expect(response.body).toEqual({
      qrCode: expect.any(String),
    });
  });

  it('/notification POST - payment', async () => {
    jest
      .spyOn(PaymentPartnerAdapter.prototype, 'getPaymentStatusById')
      .mockImplementation(async () => ({
        status: PAYMENT_STATUS.APROVADO,
        orderExternalId: externaiId,
      }));
    const idPayment = 123;
    const payload = {
      resource: `https://api.mercadolibre.com/v1/payments/${idPayment}`,
      topic: 'payment',
    };

    const response = await request(app.getHttpServer())
      .post(`/notification?topic=payment&id=${idPayment}`)
      .send(payload)
      .expect(200);

    // expect status do pagamento atualizado
    expect(response.body.status).toBe(PAYMENT_STATUS.APROVADO);
  });
});
