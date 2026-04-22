import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation globally (Uses class-validator)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('RevoBank API')
    .setDescription('The banking API for RevoBank')
    .setVersion('1.0')
    .addBearerAuth() // Adds JWT token support to Swagger
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 3000, '0.0.0.0');;
}
bootstrap();