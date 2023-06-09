import { Body, Controller, Get, Post } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiExcludeEndpoint } from "@nestjs/swagger";
import { TelegramAdapter } from "./adapters/telegram.adapter";
import axios from "axios";

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

  @Post("echo")
  @ApiExcludeEndpoint()
  async logMessage(@Body() payload: any) {
    console.log(payload);
  }

  @Post("connectToTg")
  @ApiExcludeEndpoint()
  async connectToTg(@Body() payload: any) {
    const data = await axios.post(`https://api.telegram.org/bot${process.env.TG_TOKEN}/setWebhook`,
      { url: payload.url });
    console.log(data);
  }
}