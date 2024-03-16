import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';

export interface KafkaMessage {
  key: string;
  value: string;
}

@Injectable()
export class KafkaService implements OnModuleInit {
  private kafka: Kafka;

  constructor() {
    this.kafka = new Kafka({
      clientId: process.env.APP_NAME,
      brokers: [`${process.env.KAFKA_BROKER}:${process.env.KAFKA_PORT}`]
    });
  }

  async onModuleInit() {
    await this.consumerNewOrder();
    await this.consumerOrderCompleted();
  }

  async consumerNewOrder() {
    try {
      const consumer = this.kafka.consumer({ groupId: `${process.env.APP_NAME}-pedido-novo` });

      await consumer.connect();
      await consumer.subscribe({ topic: process.env.KAFKA_TOPIC_PEDIDO_NOVO, fromBeginning: true });

      await consumer.run({
        eachMessage: async ({ message }) => {
          const mensagem = message.value.toString();

          console.log(mensagem);
        },
      });
    } catch (error) {
      console.error('Erro ao conectar na fila de pedidos novos:', error);
    }
  }

  async consumerOrderCompleted() {
    try {
      const consumer = this.kafka.consumer({ groupId: `${process.env.APP_NAME}-pedido-completo` });
  
      await consumer.connect();
      await consumer.subscribe({ topic: process.env.KAFKA_TOPIC_PEDIDO_FINALIZADO, fromBeginning: true });
  
      await consumer.run({
        eachMessage: async ({ message }) => {
          const mensagem = message.value.toString();
  
          console.log(mensagem);
        },
      });
    } catch (error) {
      console.error('Erro ao conectar na fila de pedidos completos:', error);
    }
  }

  async sendMessage(message: KafkaMessage, topic: string) {
    const producer = this.kafka.producer();
    try {
      await producer.send({
        topic,
        messages: [
          message,
        ]
      });
      console.log('Mensagem enviada com sucesso:', message);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  }
}
