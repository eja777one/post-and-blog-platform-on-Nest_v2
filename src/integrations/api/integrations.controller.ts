import { Controller, Get, Req, UseGuards, Post, Body, HttpCode }
  from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags }
  from "@nestjs/swagger";
import { SkipThrottle } from "@nestjs/throttler";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Request } from "express";
import { URL, HTTP } from "../../types";
import { JwtAuthGuard } from "../../auth/guards/jwt.auth.guard";
import { GetMyTgAuthViewModel } from "../../types";
import { sw_getTelegramLink, sw_setWebhook } from "./integrations.swagger.info";
import { GetLinkQuery } from "../app/queries/get.link.query";
import { AddTelegramIdCommand } from "../app/use-cases/add.telegram.id.uc";

@ApiTags("Integrations")
@SkipThrottle()
@Controller(URL + "/integrations")
export class IntegrationsController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {
  };

  @HttpCode(HTTP.NO_CONTENT_204)
  @Post("telegram/webhook")
  @ApiOperation(sw_setWebhook.summary)
  @ApiResponse(sw_setWebhook.status204)
  async setWebhook(@Body() payload: any) {
    console.log(payload);
    const text = payload?.message?.text;
    const id = payload?.message?.chat?.id;
    await this.commandBus.execute(new AddTelegramIdCommand(text, id));
  };


  @UseGuards(JwtAuthGuard)
  @Get("telegram/auth-bot-link")
  @ApiBearerAuth()
  @ApiOperation(sw_getTelegramLink.summary)
  @ApiResponse(sw_getTelegramLink.status200)
  @ApiResponse(sw_getTelegramLink.status401)
  async getTelegramLink(@Req() req: Request): Promise<GetMyTgAuthViewModel> {
    const link = await this.queryBus.execute(new GetLinkQuery(req.user.id));
    return link;
  };
};