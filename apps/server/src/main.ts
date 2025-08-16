import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix);

  const config = new DocumentBuilder()
    .setTitle('Amara Job board')
    .setDescription('Api documentation for amara job board aggregator')
    .setVersion('1.0')
    .addServer('/')
    .addServer('/api')
    .addBearerAuth();

  const document = SwaggerModule.createDocument(app, config.build());

  document.components = {
    ...(document.components ?? {}),
    schemas: {
      ...(document.components?.schemas ?? {}),
    },
  };

  SwaggerModule.setup('docs', app, document);

  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

void bootstrap();
