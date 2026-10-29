import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { origensPermitidas } from "./config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.setGlobalPrefix("api");
  // A regra de origem vive em ./config para não divergir da função da Vercel,
  // que monta a aplicação por conta própria em api/index.js.
  app.enableCors({
    origin: origensPermitidas(),
    credentials: true,
  });

  const port = Number(process.env.PORT ?? 3003);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`API listening on port ${port}`);
}

bootstrap();
