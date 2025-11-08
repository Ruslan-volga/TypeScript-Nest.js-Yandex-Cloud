import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common'; // ← исправленный импорт
import { AppModule } from './app.module';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Глобальный перехватчик для форматирования успешных ответов
  app.useGlobalInterceptors(new ResponseInterceptor());
  
  // Глобальный фильтр для обработки всех исключений
  app.useGlobalFilters(new AllExceptionsFilter());
  
  // Глобальная валидация с использованием встроенного ValidationPipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Удаляет поля без декораторов валидации
    forbidNonWhitelisted: true, // Выбрасывает ошибку при наличии лишних полей
    transform: true, // Автоматически преобразует типы данных
    exceptionFactory: (errors) => {
      // Кастомный формат ошибок валидации
      const errorMessages = errors.map(error => ({
        property: error.property,
        constraints: error.constraints,
        value: error.value
      }));
      
      return new BadRequestException({
        status: 'fail',
        data: errorMessages
      });
    }
  }));
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();