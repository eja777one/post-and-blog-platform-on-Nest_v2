import {
  Body, Controller, Delete, Get, Param, Put, Req, UseGuards, HttpCode
} from "@nestjs/common";
import { SkipThrottle } from "@nestjs/throttler";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Request } from "express";
import { CommentInputModel, CommentViewModel } from "../comments.types";
import { HTTP, LikeInputModel, URL } from "../../types";
import { UpdateCommentCommand } from "../app/use-cases/update.comment.uc";
import { DeleteCommentCommand } from "../app/use-cases/delete.comment.uc";
import { GetCommentQuery } from "../app/queries/get.comment.query";
import { JwtAuthGuard } from "../../auth/guards/jwt.auth.guard";
import { ChangeLikeStatusCommentCommand }
  from "../app/use-cases/change.like.status.comment.uc";
import { AddUserInfoGuard }
  from "../../pipes&valid/add.user.info.by.token.pipe";
import {
  ApiBearerAuth, ApiOperation, ApiResponse, ApiTags
} from "@nestjs/swagger";
import {
  sw_changeLikeStatus, sw_deleteComment, sw_getComment, sw_updateComment
} from "./comments.swagger.info";

@ApiTags("Comments")
@SkipThrottle()
@Controller(URL + "/comments")
export class CommentsController {
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
    await this.commandBus.execute(new ChangeLikeStatusCommentCommand(
      id, likeInput.likeStatus, req.user!.id));
  };

  @UseGuards(JwtAuthGuard)
  @HttpCode(HTTP.NO_CONTENT_204)
  @Put(":id")
  @ApiBearerAuth()
  @ApiOperation(sw_updateComment.summary)
  @ApiResponse(sw_updateComment.status204)
  @ApiResponse(sw_updateComment.status400)
  @ApiResponse(sw_updateComment.status401)
  @ApiResponse(sw_updateComment.status403)
  @ApiResponse(sw_updateComment.status404)
  async updateComment(@Param("id") id: string, @Req() req: Request,
                      @Body() commentInput: CommentInputModel) {
    await this.commandBus.execute(
      new UpdateCommentCommand(id, req.user!, commentInput));
  };

  @UseGuards(JwtAuthGuard)
  @HttpCode(HTTP.NO_CONTENT_204)
  @Delete(":id")
  @ApiBearerAuth()
  @ApiOperation(sw_deleteComment.summary)
  @ApiResponse(sw_deleteComment.status204)
  @ApiResponse(sw_deleteComment.status401)
  @ApiResponse(sw_deleteComment.status403)
  @ApiResponse(sw_deleteComment.status404)
  async deleteComment(@Param("id") id: string, @Req() req: Request) {
    await this.commandBus.execute(new DeleteCommentCommand(id, req.user!));
  };

  @UseGuards(AddUserInfoGuard)
  @Get(":id")
  @ApiOperation(sw_getComment.summary)
  @ApiResponse(sw_getComment.status200)
  @ApiResponse(sw_getComment.status404)
  async getComment(@Param("id") id: string, @Req() req: Request)
    : Promise<CommentViewModel> {
    const comment = await this.queryBus.execute(
      new GetCommentQuery(id, req.user?.id));
    return comment;
  };
};