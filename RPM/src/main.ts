/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './catch.exception';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalFilters(new AllExceptionsFilter());
  app.setGlobalPrefix('');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  // const options = new DocumentBuilder()
  //   .setBasePath('/')
  //   .setTitle('IDN')
  //   .setDescription('The IDN API system')
  //   .setVersion('1.0')
  //   .addBearerAuth('Authorization')
  //   .setSchemes('http', 'https')
  //   .build();
  // const document = SwaggerModule.createDocument(app, options, {});

  // SwaggerModule.setup('', app, document);

  await app.listen(process.env.PORT);

}
bootstrap();
