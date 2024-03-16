import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller()
export class AppController {
  constructor(
    private readonly dataSource: DataSource,
  ) {}

  @Get('/live')
  async live(): Promise<object> {
    await this.dataSource.query('SELECT 1');
    return { data: true };
  }
}
