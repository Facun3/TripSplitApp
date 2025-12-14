import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar Exception Filter global
  app.useGlobalFilters(new HttpExceptionFilter());

  // Configurar ValidationPipe global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades que no están en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades no permitidas
      transform: true, // Transforma automáticamente los tipos
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Configurar Swagger/OpenAPI
  const config = new DocumentBuilder()
    .setTitle('App de Gastos API')
    .setDescription('API para gestionar gastos compartidos en viajes')
    .setVersion('1.0')
    .addTag('trips', 'Operaciones relacionadas con viajes')
    .addTag('participants', 'Operaciones relacionadas con participantes')
    .addTag('expenses', 'Operaciones relacionadas con gastos')
    .addTag('balances', 'Operaciones relacionadas con balances y deudas')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`Swagger documentation: http://localhost:${process.env.PORT ?? 3000}/api`);
}
bootstrap();
