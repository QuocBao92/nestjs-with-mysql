import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  //app.setGlobalPrefix('dashboard');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  //app.useGlobalFilters(new HttpExceptionFilter());

  const options = new DocumentBuilder()
    //.setBasePath('/api')
    .setTitle('OSK')
    .setDescription('The IDN API system')
    .setVersion('1.0')
    .addBearerAuth('Authorization')
    .build();
  const document = SwaggerModule.createDocument(app, options, {
  });
  SwaggerModule.setup('docs', app, document);
  await app.listen(process.env.PORT || 3002);
}
bootstrap();
