import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Amazon Ads Optimizer API')
    .setDescription('Automatische Kampagnen-Optimierung für Amazon Advertising')
    .setVersion('1.0')
    .addTag('campaigns')
    .addTag('keywords')
    .addTag('optimization')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 3002;
  await app.listen(port, '0.0.0.0');
  console.log('🚀 Backend läuft auf Port:', port);
}
bootstrap();
