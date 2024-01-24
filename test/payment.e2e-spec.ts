import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('PaymentController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/payment (POST)', async () => {
    const order = {
      externalId: 456,
      total: 145.95,
      itens: [
        {
          name: 'Item 1',
          amount: 2,
          price: 50,
        },
        {
          name: 'Item 2',
          amount: 1,
          price: 45.95,
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
});
