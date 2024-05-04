import { NestFactory, Reflector, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { PrismaClientExceptionFilter } from './prisma-client-exception/prisma-client-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const config = new DocumentBuilder()
    .setTitle('TodoAPI')
    .setDescription('The Todo API description')
    .setVersion('1')
    .addServer('/api/v1')
    .addBearerAuth()
    .build();

  const documentV1 = SwaggerModule.createDocument(app, config, {
    include: [AppModule],
    deepScanRoutes: true,
    ignoreGlobalPrefix: false,
  });
  SwaggerModule.setup('api/v1/docs', app, documentV1);
  await app.listen(3000);
}
bootstrap();
