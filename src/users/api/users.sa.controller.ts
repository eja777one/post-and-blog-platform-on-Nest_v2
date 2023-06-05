import { SkipThrottle } from "@nestjs/throttler";
import {
  Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Req,
  UseGuards
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Request } from "express";
import { HTTP, Paginator, QueryType, URL } from "../../types";
import { BasicAuthGuard } from "../../pipes&valid/auth.guard.pipe";
import { prepareSAQueries } from "../../application/prepare.query";
import { BanUserInputModel, SAUserViewModel, UserInputModel }
  from "../users.types";
import { SetBanStatusCommand } from "../app/use-cases/set.ban.status.uc";
import { GetUsersBySAQuery } from "../app/queries/get.users.by.SA.query";
import { CreateUserCommand } from "../app/use-cases/create.user.uc";
import { DeleteUserCommand } from "../app/use-cases/delete.user.uc";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags }
  from "@nestjs/swagger";
import { sw_createUser, sw_deleteUser, sw_getUsers, sw_setBanStatus }
  from "./users.sa.swagger.info";
import { ApiImplicitQuery }
  from "@nestjs/swagger/dist/decorators/api-implicit-query.decorator";

@ApiTags("SuperAdmin Users")
@SkipThrottle()
@Controller(URL + "/sa/users")
export class UsersSAController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {
  };

  @UseGuards(BasicAuthGuard)
  @HttpCode(HTTP.NO_CONTENT_204)
  @Put(":id/ban")
  @ApiBearerAuth()
  @ApiOperation(sw_setBanStatus.summary)
  @ApiResponse(sw_setBanStatus.status204)
  @ApiResponse(sw_setBanStatus.status400)
  @ApiResponse(sw_setBanStatus.status401)
  async setBanStatus(@Param("id") id: string,
                     @Body() banInfo: BanUserInputModel) {
    await this.commandBus.execute(new SetBanStatusCommand(id, banInfo));
  };

  @UseGuards(BasicAuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiImplicitQuery(sw_getUsers.searchLoginTerm)
  @ApiImplicitQuery(sw_getUsers.searchEmailTerm)
  @ApiImplicitQuery(sw_getUsers.sortBy)
  @ApiImplicitQuery(sw_getUsers.sortDirection)
  @ApiImplicitQuery(sw_getUsers.pageNumber)
  @ApiImplicitQuery(sw_getUsers.pageSize)
  @ApiOperation(sw_getUsers.summary)
  @ApiResponse(sw_getUsers.status200)
  @ApiResponse(sw_getUsers.status401)
  async getUsers(@Query() query: QueryType)
    : Promise<Paginator<SAUserViewModel>> {
    const queryForSearch = prepareSAQueries(query);
    const users = await this.queryBus.execute(
      new GetUsersBySAQuery(queryForSearch));
    return users;
  };

  @UseGuards(BasicAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation(sw_createUser.summary)
  @ApiResponse(sw_createUser.status201)
  @ApiResponse(sw_createUser.status400)
  @ApiResponse(sw_createUser.status401)
  async createUser(@Req() req: Request, @Body() userInput: UserInputModel)
    : Promise<SAUserViewModel> {
    const user = await this.commandBus.execute(
      new CreateUserCommand(userInput, req.ip));
    return user;
  };

  @UseGuards(BasicAuthGuard)
  @HttpCode(HTTP.NO_CONTENT_204)
  @Delete(":id")
  @ApiBearerAuth()
  @ApiOperation(sw_deleteUser.summary)
  @ApiResponse(sw_deleteUser.status204)
  @ApiResponse(sw_deleteUser.status401)
  @ApiResponse(sw_deleteUser.status404)
  async deleteUser(@Param("id") id: string) {
    await this.commandBus.execute(new DeleteUserCommand(id));
  };
};