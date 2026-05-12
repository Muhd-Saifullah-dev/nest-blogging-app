import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TranformInterceptor } from './shared/interceptors/tranform.interceptor';
import { HttpExceptionFilter } from './shared/exception/http-exception.filter';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new TranformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );
 
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
