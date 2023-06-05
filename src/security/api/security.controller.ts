import { Controller, Delete, Get, Param, Req, UseGuards, HttpCode }
  from "@nestjs/common";
import { SkipThrottle } from "@nestjs/throttler";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Request } from "express";
import { URL, HTTP } from "../../types";
import { GetUsersSessionQuery } from "../app/queries/get.users.sessions.uc";
import { JwtRefreshAuthGuard } from "../../auth/guards/jwt.refresh.auth.guard";
import { DeleteNotCurrentSessionCommand }
  from "../app/use-cases/delete.not.current.session.uc";
import { DeleteCurrentSessionCommand }
  from "../app/use-cases/delete.current.session.uc";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { DeviceViewModel } from "../security.types";
import { sw_deleteDevice, sw_deleteNonCurrentDevices, sw_getDevices }
  from "./security.swagger.info";

@ApiTags("Devices")
@SkipThrottle()
@Controller(URL + "/security/devices")
export class SecurityController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {
  };

  @UseGuards(JwtRefreshAuthGuard)
  @Get()
  @ApiOperation(sw_getDevices.summary)
  @ApiResponse(sw_getDevices.status200)
  @ApiResponse(sw_getDevices.status401)
  async getDevices(@Req() req: Request): Promise<DeviceViewModel[]> {
    const sessions = await this.queryBus.execute(
      new GetUsersSessionQuery(req.cookies.refreshToken));
    return sessions;
  };

  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(HTTP.NO_CONTENT_204)
  @Delete()
  @ApiOperation(sw_deleteNonCurrentDevices.summary)
  @ApiResponse(sw_deleteNonCurrentDevices.status204)
  @ApiResponse(sw_deleteNonCurrentDevices.status401)
  async deleteNonCurrentDevices(@Req() req: Request) {
    await this.commandBus.execute(
      new DeleteNotCurrentSessionCommand(req.cookies.refreshToken));
  };

  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(HTTP.NO_CONTENT_204)
  @Delete(":id")
  @ApiOperation(sw_deleteDevice.summary)
  @ApiResponse(sw_deleteDevice.status204)
  @ApiResponse(sw_deleteDevice.status401)
  @ApiResponse(sw_deleteDevice.status403)
  @ApiResponse(sw_deleteDevice.status404)
  async deleteDevice(@Param("id") id: string, @Req() req: Request) {
    await this.commandBus.execute(
      new DeleteCurrentSessionCommand(req.cookies.refreshToken, id));
  };
};