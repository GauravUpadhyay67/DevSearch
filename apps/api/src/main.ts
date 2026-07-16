import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips out properties that are not defined in the DTO
      transform: true, // Automatically transforms payloads to DTO instances
    }),
  );

  app.enableCors(); // Enable CORS for frontend
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
