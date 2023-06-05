import {
  Controller, Get, Param, Query, Req, UseGuards, Post, Body
} from "@nestjs/common";
import { SkipThrottle } from "@nestjs/throttler";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Request } from "express";
import { URL, QueryType, Paginator } from "../../types";
import { prepareQueries } from "../../application/prepare.query";
import { GetBlogQuery } from "../app/queries/get.blog.query";
import { GetBlogsQuery } from "../app/queries/get.blogs.query";
import { CreateTestBlogCommand } from "../app/use-cases/create.test.blog.uc";
import { BlogInputModel, BlogViewModel } from "../blogs.types";
import { GetBlogsPostsQuery }
  from "../../posts/app/queries/get.blogs.posts.query";
import { AddUserInfoGuard }
  from "../../pipes&valid/add.user.info.by.token.pipe";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  sw_createPostNoBlogger, sw_getBlog, sw_getBlogs, sw_getBlogsPosts
} from "./blogs.swagger.info";
import { ApiImplicitQuery }
  from "@nestjs/swagger/dist/decorators/api-implicit-query.decorator";
import { PostViewModel } from "../../posts/posts.types";

@ApiTags("Blogs")
@SkipThrottle()
@Controller(URL + "/blogs")
export class BlogsController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {
  };

  @Get()
  @ApiImplicitQuery(sw_getBlogs.searchNameTerm)
  @ApiImplicitQuery(sw_getBlogs.sortBy)
  @ApiImplicitQuery(sw_getBlogs.sortDirection)
  @ApiImplicitQuery(sw_getBlogs.pageNumber)
  @ApiImplicitQuery(sw_getBlogs.pageSize)
  @ApiOperation(sw_getBlogs.summary)
  @ApiResponse(sw_getBlogs.status200)
  async getBlogs(@Req() req: Request, @Query() query: QueryType):
    Promise<Paginator<BlogViewModel>> {
    const queryForSearch = prepareQueries(query);
    const blogs = await this.queryBus.execute(new GetBlogsQuery(queryForSearch));
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

  @Get(":id")
  @ApiOperation(sw_getBlog.summary)
  @ApiResponse(sw_getBlog.status200)
  @ApiResponse(sw_getBlog.status404)
  async getBlog(@Param("id") id: string) {
    const blog = await this.queryBus.execute(new GetBlogQuery(id));
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