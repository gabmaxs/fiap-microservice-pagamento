import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDTO } from '../dto/order.dto';
import { OrderModel } from '../model/order.model';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderModel)
    private orderModelRepository: Repository<OrderModel>,
  ) {}

  create(createOrderDTO: CreateOrderDTO) {
    return this.orderModelRepository.save(createOrderDTO);
  }
}
