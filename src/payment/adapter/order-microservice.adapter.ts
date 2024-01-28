import { Injectable } from '@nestjs/common';
import { Axios } from 'axios';
import { PayloadOrderMSDTO } from '../dto/payload-order-ms.dto';

@Injectable()
export class OrderMicroserviceAdapter {
  client: Axios;
  constructor() {
    this.client = new Axios({
      baseURL: process.env.ORDER_MS_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async confirmPayment(payload: PayloadOrderMSDTO) {
    try {
      const requestURL = '/order-confirm';
      const response = await this.client.post(
        requestURL,
        JSON.stringify(payload),
      );

      return response;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
