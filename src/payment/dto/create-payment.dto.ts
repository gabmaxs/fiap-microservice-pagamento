class Item {
  name: string;
  amount: number;
  price: number;
}

export class CreatePaymentDTO {
  externalId: string;
  total: number;
  itens: Item[];
  status: number;
}
