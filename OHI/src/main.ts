import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/https-exception.filter';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  // app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  
  // const options = new DocumentBuilder()
  //   .setBasePath('/')
  //   .setTitle('IDN')
  //   .setDescription('The IDN API system')
  //   .setVersion('1.0')
  //   .addBearerAuth('Authorization')
  //   .build();
  // const document = SwaggerModule.createDocument(app, options, {
  // });
  // SwaggerModule.setup('docs', app, document);
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
