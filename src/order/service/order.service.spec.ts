import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { CreateOrderDTO } from '../dto/order.dto';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { OrderModel } from '../model/order.model';
import { Repository } from 'typeorm';
import { config } from '../../database/database.config';

type MockType<T> = {
  [P in keyof T]?: jest.Mock<object>;
};

const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  save: jest.fn((entity) => ({ ...entity, id: 1 })),
}));
describe('OrderService', () => {
  let orderService: OrderService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(config),
        TypeOrmModule.forFeature([OrderModel]),
      ],
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(OrderModel),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    orderService = app.get<OrderService>(OrderService);
  });

  it('should save order', async () => {
    const order: CreateOrderDTO = {
      externalId: 123,
      total: 145.95,
      itens: JSON.stringify([
        {
          name: 'Item 1',
          amount: 2,
          price: 50,
        },
        {
          name: 'Item 2',
          mount: 1,
          price: 45.95,
        },
      ]),
      status: 0,
    };

    const savedItem = await orderService.create(order);

    expect(savedItem).toEqual(
      expect.objectContaining({
        ...order,
        id: expect.any(Number),
      }),
    );
  });
});
