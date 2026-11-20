import { INestApplication } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function setupSwagger (app: INestApplication):void{
   const config = new DocumentBuilder()
     .setTitle('Learn-NestJs API')
     .setDescription('API description')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'accessToken lấy từ POST /auth/sign-in',
        },
        'access-token',
      )  
     .build();

   const document = SwaggerModule.createDocument(app, config);
   SwaggerModule.setup('API', app, document);
}