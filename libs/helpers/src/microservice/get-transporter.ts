import { Type } from '@nestjs/common';
import {  NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';

import { PlaceholderTransporter } from './placeholder-transporter';

export async function getTransporter(module: Type<unknown>) {
  const strategy = new PlaceholderTransporter();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    module,
    { strategy }
  );

  await app.init();

  return strategy;
}
