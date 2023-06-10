import {
  Controller, Get, Param, Query, Req, UseGuards, Post, Body, HttpCode, Delete
} from "@nestjs/common";
import { SkipThrottle } from "@nestjs/throttler";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Request } from "express";
import { URL, QueryType, Paginator, HTTP } from "../../types";
import { prepareQueries } from "../../application/prepare.query";
import { GetBlogQuery } from "../app/queries/get.blog.query";
import { GetBlogsQuery } from "../app/queries/get.blogs.query";
import { CreateTestBlogCommand } from "../app/use-cases/create.test.blog.uc";
import { BlogInputModel, BlogViewModel, PublicBlogViewModel } from "../blogs.types";
import { GetBlogsPostsQuery }
  from "../../posts/app/queries/get.blogs.posts.query";
import { AddUserInfoGuard }
  from "../../pipes&valid/add.user.info.by.token.pipe";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags }
  from "@nestjs/swagger";
import {
  sw_createPostNoBlogger, sw_getBlog, sw_getBlogs, sw_getBlogsPosts,
  sw_subscribeToBlog, sw_unsubscribeFromBlog
} from "./blogs.swagger.info";
import { ApiImplicitQuery }
  from "@nestjs/swagger/dist/decorators/api-implicit-query.decorator";
import { PostViewModel } from "../../posts/posts.types";
import { JwtAuthGuard } from "../../auth/guards/jwt.auth.guard";
import { SubscribeToBlogCommand } from "../app/use-cases/subscribe.to.blog.uc";
import { DeleteSubscribeCommand } from "../app/use-cases/delete.subscribe.uc";

@ApiTags("Blogs")
@SkipThrottle()
@Controller(URL + "/blogs")
export class BlogsController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {
  };

  @UseGuards(JwtAuthGuard)
  @HttpCode(HTTP.NO_CONTENT_204)
  @Post(":blogId/subscription")
  @ApiBearerAuth()
  @ApiOperation(sw_subscribeToBlog.summary)
  @ApiResponse(sw_subscribeToBlog.status204)
  @ApiResponse(sw_subscribeToBlog.status401)
  @ApiResponse(sw_subscribeToBlog.status404)
  async subscribeToBlog(@Param("blogId") blogId: string,
                        @Req() req: Request) {
    await this.commandBus.execute(
      new SubscribeToBlogCommand(blogId, req.user.id));
  };

  @UseGuards(JwtAuthGuard)
  @HttpCode(HTTP.NO_CONTENT_204)
  @Delete(":blogId/subscription")
  @ApiBearerAuth()
  @ApiOperation(sw_unsubscribeFromBlog.summary)
  @ApiResponse(sw_unsubscribeFromBlog.status204)
  @ApiResponse(sw_unsubscribeFromBlog.status401)
  @ApiResponse(sw_unsubscribeFromBlog.status404)
  async unsubscribeFromBlog(@Param("blogId") blogId: string,
                            @Req() req: Request) {
    await this.commandBus.execute(
      new DeleteSubscribeCommand(blogId, req.user.id));
  };

  @UseGuards(AddUserInfoGuard)
  @Get()
  @ApiImplicitQuery(sw_getBlogs.searchNameTerm)
  @ApiImplicitQuery(sw_getBlogs.sortBy)
  @ApiImplicitQuery(sw_getBlogs.sortDirection)
  @ApiImplicitQuery(sw_getBlogs.pageNumber)
  @ApiImplicitQuery(sw_getBlogs.pageSize)
  @ApiOperation(sw_getBlogs.summary)
  @ApiResponse(sw_getBlogs.status200)
  async getBlogs(@Req() req: Request, @Query() query: QueryType):
    Promise<Paginator<PublicBlogViewModel>> {
    const queryForSearch = prepareQueries(query);
    const blogs = await this.queryBus.execute(
      new GetBlogsQuery(queryForSearch, req.user?.id));
    return blogs;
  };

  @UseGuards(AddUserInfoGuard)
  @Get(":id/posts")
  @ApiImplicitQuery(sw_getBlogsPosts.sortBy)
  @ApiImplicitQuery(sw_getBlogsPosts.sortDirection)
  @ApiImplicitQuery(sw_getBlogsPosts.pageNumber)
  @ApiImplicitQuery(sw_getBlogsPosts.pageSize)
  @ApiOperation(sw_getBlogsPosts.summary)
  @ApiResponse(sw_getBlogsPosts.status200)
  @ApiResponse(sw_getBlogsPosts.status404)
  async getBlogsPosts(@Param("id") id: string, @Req() req: Request,
                      @Query() query: QueryType)
    : Promise<Paginator<PostViewModel>> {
    const queryForSearch = prepareQueries(query);
    const blogsPosts = await this.queryBus.execute(
      new GetBlogsPostsQuery(queryForSearch, id, req.user?.id));
    return blogsPosts;
  };

  @UseGuards(AddUserInfoGuard)
  @Get(":id")
  @ApiOperation(sw_getBlog.summary)
  @ApiResponse(sw_getBlog.status200)
  @ApiResponse(sw_getBlog.status404)
  async getBlog(@Param("id") id: string, @Req() req: Request)
    : Promise<PublicBlogViewModel> {
    const blog = await this.queryBus.execute(new GetBlogQuery(id, req.user?.id));
    return blog;
  };

  @Post()
  @ApiOperation(sw_createPostNoBlogger.summary)
  @ApiResponse(sw_createPostNoBlogger.status201)
  @ApiResponse(sw_createPostNoBlogger.status404)
  async createPostNoBlogger(@Body() blogInput: BlogInputModel) {
    const blog = await this.commandBus
      .execute(new CreateTestBlogCommand(blogInput));
    return blog;
  };
};