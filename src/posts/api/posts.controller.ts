import {
  Body, Controller, Get, HttpCode, Param, Post, Put, Req, Query, UseGuards
} from "@nestjs/common";
import { SkipThrottle } from "@nestjs/throttler";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Request } from "express";
import { prepareQueries } from "../../application/prepare.query";
import { URL, QueryType, HTTP, LikeInputModel, Paginator } from "../../types";
import { CommentInputModel, CommentViewModel }
  from "../../comments/comments.types";
import { GetPostsQuery } from "../app/queries/get.posts.query";
import { GetPostQuery } from "../app/queries/get.post.query";
import { AddCommentCommand } from "../../comments/app/use-cases/add.comment.uc";
import { JwtAuthGuard } from "../../auth/guards/jwt.auth.guard";
import { ChangeLikeStatusCommand }
  from "../app/use-cases/change.like.status.post.uc";
import { GetCommentsQuery }
  from "../../comments/app/queries/get.comments.query";
import { AddUserInfoGuard }
  from "../../pipes&valid/add.user.info.by.token.pipe";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags }
  from "@nestjs/swagger";
import {
  sw_changeLikeStatus, sw_createPostsComment, sw_getPost, sw_getPosts,
  sw_getPostsComments
} from "./post.swagger.info";
import { ApiImplicitQuery }
  from "@nestjs/swagger/dist/decorators/api-implicit-query.decorator";
import { PostViewModel } from "../posts.types";

@ApiTags("Posts")
@SkipThrottle()
@Controller(URL + "/posts")
export class PostsController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {
  };

  @UseGuards(JwtAuthGuard)
  @HttpCode(HTTP.NO_CONTENT_204)
  @Put(":id/like-status")
  @ApiBearerAuth()
  @ApiOperation(sw_changeLikeStatus.summary)
  @ApiResponse(sw_changeLikeStatus.status204)
  @ApiResponse(sw_changeLikeStatus.status400)
  @ApiResponse(sw_changeLikeStatus.status401)
  @ApiResponse(sw_changeLikeStatus.status404)
  async changeLikeStatus(@Param("id") id: string, @Req() req: Request,
                         @Body() likeInput: LikeInputModel) {
    await this.commandBus.execute(new ChangeLikeStatusCommand(id,
      likeInput.likeStatus, req.user!.id));
  };

  @UseGuards(JwtAuthGuard)
  @Post(":id/comments")
  @ApiBearerAuth()
  @ApiOperation(sw_createPostsComment.summary)
  @ApiResponse(sw_createPostsComment.status201)
  @ApiResponse(sw_createPostsComment.status400)
  @ApiResponse(sw_createPostsComment.status401)
  @ApiResponse(sw_createPostsComment.status404)
  async createPostsComment(@Param("id") id: string, @Req() req: Request,
                           @Body() commentInput: CommentInputModel)
    : Promise<CommentViewModel> {
    const comment = await this.commandBus.execute(
      new AddCommentCommand(req.user!, id, commentInput));
    return comment;
  };

  @UseGuards(AddUserInfoGuard)
  @Get(":id/comments")
  @ApiImplicitQuery(sw_getPostsComments.sortBy)
  @ApiImplicitQuery(sw_getPostsComments.sortDirection)
  @ApiImplicitQuery(sw_getPostsComments.pageNumber)
  @ApiImplicitQuery(sw_getPostsComments.pageSize)
  @ApiOperation(sw_getPostsComments.summary)
  @ApiResponse(sw_getPostsComments.status200)
  @ApiResponse(sw_getPostsComments.status404)
  async getPostsComments(@Param("id") id: string, @Req() req: Request,
                         @Query() query: QueryType)
    : Promise<Paginator<CommentViewModel>> {
    const queryForSearch = prepareQueries(query);
    const comments = await this.queryBus.execute(
      new GetCommentsQuery(queryForSearch, id, req.user?.id));
    return comments;
  };

  @UseGuards(AddUserInfoGuard)
  @Get()
  @ApiImplicitQuery(sw_getPosts.sortBy)
  @ApiImplicitQuery(sw_getPosts.sortDirection)
  @ApiImplicitQuery(sw_getPosts.pageNumber)
  @ApiImplicitQuery(sw_getPosts.pageSize)
  @ApiOperation(sw_getPosts.summary)
  @ApiResponse(sw_getPosts.status200)
  async getPosts(@Query() query: QueryType, @Req() req: Request)
    : Promise<Paginator<PostViewModel>> {
    const queryForSearch = prepareQueries(query);
    const posts = await this.queryBus.execute(
      new GetPostsQuery(queryForSearch, req.user?.id));
    return posts;
  };

  @UseGuards(AddUserInfoGuard)
  @Get(":id")
  @ApiOperation(sw_getPost.summary)
  @ApiResponse(sw_getPost.status200)
  @ApiResponse(sw_getPost.status404)
  async getPost(@Param("id") id: string, @Req() req: Request) {
    const post = await this.queryBus.execute(new GetPostQuery(id, req.user?.id));
    return post;
  };
};