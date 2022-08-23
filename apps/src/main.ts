import { HttpStatus, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser = require('cookie-parser');
import passport = require('passport');

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import * as session from 'express-session';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT || 8080;

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    })
  );

  app.use(
    session({
      secret: environment.secretKey as string,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        signed: true,
        sameSite: 'strict',
        secure: environment.production,
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(cookieParser(environment.secretKey));
  app.setGlobalPrefix(environment.globalPrefix);
  app.enableCors({
    origin: true,
    // origin: ['http://localhost:4200'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    // exposedHeaders: ['Authorization'],
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${environment.globalPrefix}`
  );
}

bootstrap();
