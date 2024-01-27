import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDTO, CreatedOrderDTO } from '../dto/order.dto';
import { OrderModel } from '../model/order.model';

@Injectable()
export class OrderService {
  transaction: any;
  constructor(
    @InjectRepository(OrderModel)
    private orderModelRepository: Repository<OrderModel>,
  ) {}

  setTransaction(transaction) {
    this.transaction = transaction;
    return this;
  }

  create(createOrderDTO: CreateOrderDTO): Promise<CreatedOrderDTO> {
    return this.orderModelRepository.save(
      createOrderDTO,
      this.transaction,
    ) as Promise<CreatedOrderDTO>;
  }

  getByExternalId(externalId: string) {
    return this.orderModelRepository.findOneBy({
      externalId,
    });
  }
}
