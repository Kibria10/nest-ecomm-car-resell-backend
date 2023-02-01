import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, //removes extra property if users tries to send extra keys with theier incoming body request. basically allows to send only the keys that are defined in the DTO.
  }));
  await app.listen(3000);
}
bootstrap();
