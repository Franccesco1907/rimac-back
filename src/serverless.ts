import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common/pipes';
import { AppModule } from './app.module';
import serverlessExpress from '@codegenie/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';

let server: Handler;


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Star Wars API')
    .setDescription(
      `Star Wars API
    <br>Created by: <b>Franccesco Jaimes Agreda</b>
    <br>GitHub: <a href="https://github.com/Franccesco1907" target="_blank">Franccesco1907</a>
    <br>Linkedin: <a href="https://www.linkedin.com/in/franccesco-michael-jaimes-agreda-7a00511a8/" target="_blank">Franccesco Michael Jaimes Agreda</a>
    <br>Gmail: <a href="mailto:franccescojaimesagreda@gmail.com">franccescojaimesagreda@gmail.com</a>
    `)
    .setVersion('1.0')
    .addTag('Star Wars API')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');

  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();

  return serverlessExpress({ app: expressApp })
}


export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback)
}