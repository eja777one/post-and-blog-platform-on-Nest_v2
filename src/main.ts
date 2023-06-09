import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { startApp } from "./application/start.app";
import { UserViewModel } from "./users/users.types";
import { useContainer } from "class-validator";
import { PostsModule } from "./posts/posts.module";
import { SwaggerModule } from "@nestjs/swagger";
import { swaggerConfig, writeSwaggerFiles } from "./swagger.config";
import ngrok from "ngrok";
import { TelegramAdapter } from "./adapters/telegram.adapter";

declare global {
  namespace Express {
    interface Request {
      user: UserViewModel | undefined;
    }
  }
}

const settings = { baseUrl: process.env.BASE_URL || "https://localhost:3004" };

async function connectToNgrok() {
  const url = await ngrok.connect(3004);
  return url;
}

async function bootstrap() {
  const rawApp = await NestFactory.create(AppModule);
  const app = startApp(rawApp);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  useContainer(app.select(PostsModule), { fallbackOnErrors: true });

  const telegramAdapter = await app.resolve(TelegramAdapter);

  const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("swagger", app, swaggerDoc);

  await app.listen(3004);

  // get the swagger json file (if app is running in development mode)
  if (process.env.NODE_ENV === "development") writeSwaggerFiles();

  let baseUrl = settings.baseUrl;

  if (process.env.NODE_ENV === "development") {
    baseUrl = await connectToNgrok();
  }

  console.log(baseUrl);

  await telegramAdapter.setWebhook(baseUrl +
    "/hometask_30/api/integrations/telegram/webhook");
}

bootstrap();