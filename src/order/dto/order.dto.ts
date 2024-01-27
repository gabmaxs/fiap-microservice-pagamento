export class CreateOrderDTO {
  externalId: string;
  total: number;
  itens: string;
  status: number;
}

export class CreatedOrderDTO {
  id: number;
  externalId: string;
  total: number;
  itens: string;
  status: number;
}
