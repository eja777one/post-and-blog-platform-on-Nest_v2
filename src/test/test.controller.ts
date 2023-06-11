import { SkipThrottle } from "@nestjs/throttler";
import { UsersQueryRepository } from "../users/inf/users.q.repo";
import {
  Controller, Delete, Res, HttpStatus, Get, Param, NotFoundException, HttpCode,
  UseGuards
} from "@nestjs/common";
import { HTTP, URL } from "../types";
import { Response } from "express";
import { PostsRepository } from "../posts/inf/posts.db.repo";
import { CommentsRepository } from "../comments/inf/comments.db.repo";
import { BlogsRepository } from "../blogs/inf/blogs.db.repo";
import { UsersRepository } from "../users/inf/users.db.repo";
import { PasswordRecoveryRepository } from "../users/inf/pass.rec.db.repo";
import { SecurityRepository } from "../security/inf/security.db.repo";
import { SecurityQueryRepository } from "../security/inf/security.q.repo";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { QuizRepository } from "../quiz/inf/quiz.db.repo";
import { ApiBasicAuth, ApiOperation, ApiResponse, ApiTags }
  from "@nestjs/swagger";
import { BasicAuthGuard } from "../pipes&valid/auth.guard.pipe";
import { sw_deleteAllData, sw_getCodeData, sw_getUser, sw_getUsersSessions }
  from "./test.swagger.info";
import { PassRecTestViewModel, UserTestViewModel } from "../users/users.types";
import { DeviceViewModel } from "../security/security.types";
import axios from "axios";
import { TelegramAdapter } from "../adapters/telegram.adapter";

@ApiTags("Test")
@SkipThrottle()
@Controller(URL + "/testing")
export class TestsController {
  constructor(
    protected securityRepository: SecurityRepository,
    protected securityQueryRepository: SecurityQueryRepository,
    protected passwordRecoveryRepository: PasswordRecoveryRepository,
    protected blogsRepository: BlogsRepository,
    protected postsRepository: PostsRepository,
    protected commentsRepository: CommentsRepository,
    protected usersRepository: UsersRepository,
    protected usersQueryRepository: UsersQueryRepository,
    protected quizRepository: QuizRepository,
    protected telegramAdapter: TelegramAdapter,
    @InjectDataSource() private dataSource: DataSource
  ) {
  }

  // @UseGuards(BasicAuthGuard)
  @HttpCode(HTTP.NO_CONTENT_204)
  @Delete("all-data")
  // @ApiBasicAuth()
  @ApiOperation(sw_deleteAllData.summary)
  @ApiResponse(sw_deleteAllData.status204)
  @ApiResponse(sw_deleteAllData.status401)
  async deleteAllData(@Res() res: Response) {
    await this.blogsRepository.deleteAllSQL();
    await this.postsRepository.deleteAllSQL();
    await this.commentsRepository.deleteAllSQL();
    await this.usersRepository.deleteAllSQL();
    await this.securityRepository.deleteAllSQL();
    await this.passwordRecoveryRepository.deleteAllSQL();
    await this.quizRepository.deleteAllSQL();
    await this.telegramAdapter.echo();
    res.sendStatus(HttpStatus.NO_CONTENT);
  }

  @UseGuards(BasicAuthGuard)
  @Get("user/:email")
  @ApiBasicAuth()
  @ApiOperation(sw_getUser.summary)
  @ApiResponse(sw_getUser.status200)
  @ApiResponse(sw_getUser.status401)
  @ApiResponse(sw_getUser.status404)
  async getUser(@Param("email") email: string)
    : Promise<UserTestViewModel> {
    const user = await this.usersQueryRepository.getUserByEmailSQL(email);
    if (!user) throw new NotFoundException();
    return {
      id: user.id,
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
      confirmationCode: user.userEmailConfirmation.confirmationCode,
      expirationDate: user.userEmailConfirmation.expirationDate,
      isConfirmed: user.userEmailConfirmation.isConfirmed,
      sentEmailsCount: user.userSentEmails.length
    };
  }

  @UseGuards(BasicAuthGuard)
  @Get("session/:userId")
  @ApiBasicAuth()
  @ApiOperation(sw_getUsersSessions.summary)
  @ApiResponse(sw_getUsersSessions.status200)
  @ApiResponse(sw_getUsersSessions.status401)
  @ApiResponse(sw_getUsersSessions.status404)
  async getUsersSessions(@Param("userId") userId: string)
    : Promise<DeviceViewModel[]> {
    const sessions = await this.securityQueryRepository
      .getUsersSessionsSQL(userId);
    if (!sessions) throw new NotFoundException();
    return sessions;
  }

  @UseGuards(BasicAuthGuard)
  @Get("code/:id")
  @ApiBasicAuth()
  @ApiOperation(sw_getCodeData.summary)
  @ApiResponse(sw_getCodeData.status200)
  @ApiResponse(sw_getCodeData.status401)
  @ApiResponse(sw_getCodeData.status404)
  async getCodeData(@Param("id") id: string)
    : Promise<PassRecTestViewModel> {
    const codeData = await this.passwordRecoveryRepository.getCodeData(id);
    if (!codeData) throw new NotFoundException();
    return codeData;
  }
}