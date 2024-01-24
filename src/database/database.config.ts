import { OrderModel } from '../order/model/order.model';
import { PaymentModel } from '../payment/model/payment.model';
import { DataSourceOptions } from 'typeorm';

export const config: DataSourceOptions = {
  type: 'sqlite',
  database: '.db/sql',
  synchronize: true,
  entities: [OrderModel, PaymentModel],
  // entities: [__dirname + '../**/model/*.model{.ts,.js}'],
};
