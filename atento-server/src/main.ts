import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global pipes for validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true, // Automatically transforms payloads to be objects typed according to their DTO classes
    }),
  );

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('ATento API')
    .setDescription('ATento REST API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.enableCors(); // Enable CORS for frontend

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
