import { Logger } from '@nestjs/common';
import { CustomTransportStrategy, Server } from '@nestjs/microservices';

export class PlaceholderTransporter extends Server implements CustomTransportStrategy {
  listen(callback: (...optionalParams: unknown[]) => unknown) {
    Logger.log('custom aws transporter listening');
    callback();
  }

  close() {
    Logger.log('custom aws transporter closed');
  }

  on() {
    throw new Error('Method not implemented.');
  }

  unwrap<T = never>(): T {
    throw new Error('Method not implemented.');
  }
}
