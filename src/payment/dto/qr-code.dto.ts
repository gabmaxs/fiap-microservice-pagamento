export class CreateQRCodeDTO {
  externalId: string;
  total: number;
  itens: unknown[];
}

export class CreatedQRCodeDTO {
  externalId: string;
  qrCode: string;
}
