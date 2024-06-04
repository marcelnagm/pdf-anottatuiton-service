import { tracer } from 'dd-trace';
tracer.init({ logInjection: true });
import { NestFactory } from "@nestjs/core";
import { json } from "body-parser";

import { AppModule } from "./app.module";

import { graylogMiddleware } from "./middlewares/graylog.middleware";
import { GrayLogger } from "./helpers/graylog";
import { NODE_ENV, HTTP_PORT, ACTIVATE_GRAYLOG } from "./config";
import { sqsService } from "./sqs-queue";

const grayLogger = new GrayLogger();

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  app.get(sqsService).startSQS();
  
  app.enableCors({
    origin: true,
  });

  app.use(json({ limit: "250mb" }));

  if (ACTIVATE_GRAYLOG === true) {
    app.use(graylogMiddleware);
    app.useLogger(grayLogger);
  }

  await app.listen(HTTP_PORT);

  console.log("-------------------------------------------------------------");
  console.log(`🚀 App starting in ${NODE_ENV} mode on port ${HTTP_PORT}!! 🚀`);
  console.log("-------------------------------------------------------------");
};
bootstrap();
