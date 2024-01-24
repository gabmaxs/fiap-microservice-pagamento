class Item {
  name: string;
  amount: number;
  price: number;
}

export class CreatePaymentDTO {
  externalId: number;
  total: number;
  itens: Item[];
  status: number;
}
