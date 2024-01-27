import { Injectable } from '@nestjs/common';
import { Axios } from 'axios';
import { CreateQRCodeDTO, CreatedQRCodeDTO } from '../dto/qr-code.dto';
import { PAYMENT_STATUS } from '../consts/payment-status.const';

@Injectable()
export class PaymentPartnerAdapter {
  client: Axios;
  constructor() {
    this.client = new Axios({
      baseURL: process.env.MERCADO_PAGO_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.MERCADO_PAGO_TOKEN}`,
      },
    });
  }

  async generateQRCode(
    createQRCode: CreateQRCodeDTO,
  ): Promise<CreatedQRCodeDTO> {
    try {
      const userId = process.env.MERCADO_PAGO_USER;
      const empresaId = process.env.MERCADO_PAGO_EMPRESA_ID;
      const requestURL = `/instore/orders/qr/seller/collectors/${userId}/pos/${empresaId}/qrs`;
      const payload = {
        cash_out: {
          amount: 0,
        },
        description: 'Compra Tech Challenge',
        external_reference: createQRCode.externalId,
        items: createQRCode.itens.map((item: any) => ({
          title: item.name,
          unit_price: item.price,
          quantity: item.amount,
          unit_measure: 'unit',
          total_amount: item.price * item.amount,
        })),
        notification_url:
          'https://webhook.site/64403458-1ea5-469a-9427-49d1e4b5cc52/notifications',
        title: 'Compra em Tech Challenge Store',
        total_amount: createQRCode.total,
      };
      const { data } = await this.client.post(
        requestURL,
        JSON.stringify(payload),
      );

      const parsedData = JSON.parse(data);

      const retorno: CreatedQRCodeDTO = {
        externalId: parsedData.in_store_order_id,
        qrCode: parsedData.qr_data,
      };

      return retorno;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getPaymentStatusById(id: number) {
    try {
      const requestURL = `/v1/payments/${id}`;
      const { data } = await this.client.get(requestURL);

      const parsedData = JSON.parse(data);

      const retorno = {
        status: this.mapStatus(data.status),
        orderExternalId: parsedData.external_reference,
      };

      return retorno;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  mapStatus(status: string): number {
    const statusObj = {
      approved: 'APROVADO',
      canceled: 'CANCELED',
    };

    return PAYMENT_STATUS[statusObj[status]];
  }
}
