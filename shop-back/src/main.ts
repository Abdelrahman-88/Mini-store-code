import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get<ConfigService>(ConfigService);
  const swaggerConfig = new DocumentBuilder()
  .setTitle('Mini store (Shop) Documentation')
  .setDescription(`Job Posting CRUD API`)
  .setVersion('1.0')
  .addBearerAuth(
    {
      // I was also testing it without prefix 'Bearer ' before the JWT
      description: `[just text field] Please enter token in following format: Bearer <JWT>`,
      name: 'Authorization',
      bearerFormat: 'Bearer', // I`ve tested not to use this field, but the result was the same
      scheme: 'Bearer',
      type: 'http', // I`ve attempted type: 'apiKey' too
      in: 'Header',
    },
    'access-token', // This name here is important for matching up with @ApiBearerAuth() in your controller!
  )
  .build();

const doc = SwaggerModule.createDocument(app, swaggerConfig);
SwaggerModule.setup('doc', app, doc);
app.enableCors();
  await app.listen(configService.get("PORT")||5000);
}
bootstrap();
