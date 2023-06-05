import { SkipThrottle } from "@nestjs/throttler";
import {
  Body, Controller, Get, HttpCode, Param, Put, Query, UseGuards, Req
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { HTTP, Paginator, QueryType, URL } from "../../types";
import { BloggerBanUserInputModel, BloggerUserViewModel } from "../users.types";
import { JwtAuthGuard } from "../../auth/guards/jwt.auth.guard";
import { prepareQueries } from "../../application/prepare.query";
import { Request } from "express";
import { SetBanStatusByBloggerCommand }
  from "../app/use-cases/set.ban.status.by.blogger";
import { GetBlogsBannedUsersQuery }
  from "../app/queries/get.blogs.banned.users.query";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags }
  from "@nestjs/swagger";
import { sw_getBlogsBannedUsers, sw_setBanStatusByBlogger }
  from "./user.blogger.swagger.info";
import { ApiImplicitQuery }
  from "@nestjs/swagger/dist/decorators/api-implicit-query.decorator";

@ApiTags("Blogger Users")
@SkipThrottle()
@Controller(URL + "/blogger/users")
export class UsersBloggerController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {
  };

  @UseGuards(JwtAuthGuard)
  @HttpCode(HTTP.NO_CONTENT_204)
  @Put(":id/ban")
  @ApiBearerAuth()
  @ApiOperation(sw_setBanStatusByBlogger.summary)
  @ApiResponse(sw_setBanStatusByBlogger.status204)
  @ApiResponse(sw_setBanStatusByBlogger.status400)
  @ApiResponse(sw_setBanStatusByBlogger.status401)
  async setBanStatusByBlogger(@Param("id") id: string, @Req() req: Request,
                              @Body() banInfo: BloggerBanUserInputModel) {
    await this.commandBus.execute(
      new SetBanStatusByBloggerCommand(id, banInfo, req.user.id));
  };

  @UseGuards(JwtAuthGuard)
  @Get("blog/:blogId")
  @ApiBearerAuth()
  @ApiImplicitQuery(sw_getBlogsBannedUsers.searchLoginTerm)
  @ApiImplicitQuery(sw_getBlogsBannedUsers.sortBy)
  @ApiImplicitQuery(sw_getBlogsBannedUsers.sortDirection)
  @ApiImplicitQuery(sw_getBlogsBannedUsers.pageNumber)
  @ApiImplicitQuery(sw_getBlogsBannedUsers.pageSize)
  @ApiOperation(sw_getBlogsBannedUsers.summary)
  @ApiResponse(sw_getBlogsBannedUsers.status200)
  @ApiResponse(sw_getBlogsBannedUsers.status401)
  async getBlogsBannedUsers(@Param("blogId") blogId: string,
                            @Query() query: QueryType, @Req() req: Request)
    : Promise<Paginator<BloggerUserViewModel>> {
    const queryForSearch = prepareQueries(query);
    const users = await this.queryBus.execute(
      new GetBlogsBannedUsersQuery(queryForSearch, blogId, req.user.id));
    return users;
  };
};