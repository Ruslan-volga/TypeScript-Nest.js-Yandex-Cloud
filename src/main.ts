import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Добавляем middleware для правильной кодировки
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  
  // Включаем CORS если нужно
  app.enableCors();
  
  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}
bootstrap();