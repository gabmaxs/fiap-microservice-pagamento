export class CreateOrderDTO {
  externalId: number;
  total: number;
  itens: string;
  status: number;
}

export class CreatedOrderDTO {
  id: number;
  externalId: number;
  total: number;
  itens: string;
  status: number;
}
