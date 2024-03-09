import { OrderModel } from '../order/model/order.model';
import { PaymentModel } from '../payment/model/payment.model';
import { DataSourceOptions } from 'typeorm';

const dbType = process.env.DB_TYPE || 'sqlite';

const configs = {
  sqlite: {
    type: 'sqlite',
    database: process.env.DB_DATABASE || '.db/sql',
  },
  mysql: {
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'payment-ms',
  }
};

export const config: DataSourceOptions = {
  ...configs[dbType],
  synchronize: true,
  entities: [OrderModel, PaymentModel],
  // entities: [__dirname + '../**/model/*.model{.ts,.js}'],
};
