import { SkipThrottle } from "@nestjs/throttler";
import {
  Body, Controller, Get, HttpCode, Param, Put, Query, UseGuards
} from "@nestjs/common";
import { HTTP, Paginator, QueryType, URL } from "../../types";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { BasicAuthGuard } from "../../pipes&valid/auth.guard.pipe";
import { prepareQueries } from "../../application/prepare.query";
import { SaBanBlogInputModel, SuperAdminBlogViewModel } from "../blogs.types";
import { SetBanStatusForBlogCommand }
  from "../app/use-cases/set.ban.status.for.blog";
import { bindBlogWithUserCommand }
  from "../app/use-cases/bind.blog.with.user.uc";
import { GetSuperAdminBlogsQuery }
  from "../app/queries/get.super.admin.blogs.query";
import {
  ApiBasicAuth, ApiOperation, ApiResponse, ApiTags
} from "@nestjs/swagger";
import {
  sw_bindBlogWithUser, sw_getBlogs, sw_setBanStatusForBlog
} from "./blogs.sa.swagger.info";
import { ApiImplicitQuery }
  from "@nestjs/swagger/dist/decorators/api-implicit-query.decorator";

@ApiTags("SuperAdmin Blogs")
@SkipThrottle()
@Controller(URL + "/sa/blogs")
export class SuperAdminBlogsController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {
  };

  @UseGuards(BasicAuthGuard)
  @HttpCode(HTTP.NO_CONTENT_204)
  @Put(":id/ban")
  @ApiBasicAuth()
  @ApiOperation(sw_setBanStatusForBlog.summary)
  @ApiResponse(sw_setBanStatusForBlog.status204)
  @ApiResponse(sw_setBanStatusForBlog.status400)
  @ApiResponse(sw_setBanStatusForBlog.status401)
  async setBanStatusForBlog(@Param("id") id: string,
                            @Body() banInput: SaBanBlogInputModel) {
    await this.commandBus.execute(new SetBanStatusForBlogCommand(id, banInput));
  };

  @UseGuards(BasicAuthGuard)
  @HttpCode(HTTP.NO_CONTENT_204)
  @Put(":id/bind-with-user/:userId")
  @ApiBasicAuth()
  @ApiOperation(sw_bindBlogWithUser.summary)
  @ApiResponse(sw_bindBlogWithUser.status204)
  @ApiResponse(sw_bindBlogWithUser.status400)
  @ApiResponse(sw_bindBlogWithUser.status401)
  async bindBlogWithUser(@Param("id") id: string,
                         @Param("userId") userId: string) {
    await this.commandBus.execute(new bindBlogWithUserCommand(id, userId));
  };

  @UseGuards(BasicAuthGuard)
  @Get()
  @ApiBasicAuth()
  @ApiImplicitQuery(sw_getBlogs.searchNameTerm)
  @ApiImplicitQuery(sw_getBlogs.sortBy)
  @ApiImplicitQuery(sw_getBlogs.sortDirection)
  @ApiImplicitQuery(sw_getBlogs.pageNumber)
  @ApiImplicitQuery(sw_getBlogs.pageSize)
  @ApiOperation(sw_getBlogs.summary)
  @ApiResponse(sw_getBlogs.status200)
  @ApiResponse(sw_getBlogs.status401)
  async getBlogs(@Query() query: QueryType)
    : Promise<Paginator<SuperAdminBlogViewModel>> {
    const queryForSearch = prepareQueries(query);
    const blogs = await this.queryBus.execute(
      new GetSuperAdminBlogsQuery(queryForSearch));
    return blogs;
  };
};