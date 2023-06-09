import { Body, Controller, Get, Post } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiExcludeEndpoint } from "@nestjs/swagger";
import { TelegramAdapter } from "./adapters/telegram.adapter";

@Controller("app")
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly telegramAdapter: TelegramAdapter) {
  }

  @Get()
  @ApiExcludeEndpoint()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("hook")
  @ApiExcludeEndpoint()
  forTelegramHook(@Body() payload: any) {
    if (payload.message.text === "сколько времени?") {
      this.telegramAdapter.sendMessage(new Date().toString(), payload.message.from.id);
    } else {
      this.telegramAdapter.sendMessage("Не знаю", payload.message.from.id);
    }

    console.log(payload);
    return { status: "success" };
  }
}