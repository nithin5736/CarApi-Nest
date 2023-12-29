import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { setUpApp } from './setup-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // setUpApp(app);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
