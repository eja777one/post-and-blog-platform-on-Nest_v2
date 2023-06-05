import { SkipThrottle } from "@nestjs/throttler";
import {
  Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { HTTP, Paginator, QueryType, URL } from "../../types";
import { BasicAuthGuard } from "../../pipes&valid/auth.guard.pipe";
import { prepareQuestionsQueries } from "../../application/prepare.query";
import { PublishInputModel, QuestionInputModel, SAQuestionViewModel }
  from "../quiz.types";
import { CreateQuestionCommand } from "../app/use-cases/create.question.uc";
import { DeleteQuestionCommand } from "../app/use-cases/delete.question.uc";
import { UpdateQuestionCommand } from "../app/use-cases/update.question.uc";
import { PublishQuestionCommand } from "../app/use-cases/publish.question.uc";
import { ApiBasicAuth, ApiOperation, ApiResponse, ApiTags }
  from "@nestjs/swagger";
import {
  sw_createQuestion, sw_deleteQuestion, sw_getQuestions, sw_publishQuestion,
  sw_updateQuestion
} from "./quiz.sa.swagger.info";
import { ApiImplicitQuery }
  from "@nestjs/swagger/dist/decorators/api-implicit-query.decorator";
import { GetQuestionsBySAQuery } from "../app/queries/get.questions.by.sa.query";
import { GetQuestionBySAQuery } from "../app/queries/get.question.by.sa.query";

@ApiTags("QuizQuestions")
@SkipThrottle()
@Controller(URL + "/sa/quiz/questions")
export class QuizSAController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {
  };

  @UseGuards(BasicAuthGuard)
  @Get()
  @ApiBasicAuth()
  @ApiImplicitQuery(sw_getQuestions.publishedStatus)
  @ApiImplicitQuery(sw_getQuestions.bodySearchTerm)
  @ApiImplicitQuery(sw_getQuestions.sortBy)
  @ApiImplicitQuery(sw_getQuestions.sortDirection)
  @ApiImplicitQuery(sw_getQuestions.pageNumber)
  @ApiImplicitQuery(sw_getQuestions.pageSize)
  @ApiOperation(sw_getQuestions.summary)
  @ApiResponse(sw_getQuestions.status200)
  @ApiResponse(sw_getQuestions.status401)
  async getQuestions(@Query() query: QueryType)
    : Promise<Paginator<SAQuestionViewModel>> {
    const queryForSearch = prepareQuestionsQueries(query);
    const questions = await this.queryBus.execute(
      new GetQuestionsBySAQuery(queryForSearch));
    return questions;
  };

  @UseGuards(BasicAuthGuard)
  @Get(":id")
  // @ApiBasicAuth()
  // @ApiImplicitQuery(sw_getQuestions.publishedStatus)
  // @ApiImplicitQuery(sw_getQuestions.bodySearchTerm)
  // @ApiImplicitQuery(sw_getQuestions.sortBy)
  // @ApiImplicitQuery(sw_getQuestions.sortDirection)
  // @ApiImplicitQuery(sw_getQuestions.pageNumber)
  // @ApiImplicitQuery(sw_getQuestions.pageSize)
  // @ApiOperation(sw_getQuestions.summary)
  // @ApiResponse(sw_getQuestions.status200)
  // @ApiResponse(sw_getQuestions.status401)
  async getQuestion(@Param("id") id: string)
    : Promise<SAQuestionViewModel> {
    const question = await this.queryBus.execute(new GetQuestionBySAQuery(id));
    return question;
  };

  @UseGuards(BasicAuthGuard)
  @Post()
  @ApiBasicAuth()
  @ApiOperation(sw_createQuestion.summary)
  @ApiResponse(sw_createQuestion.status201)
  @ApiResponse(sw_createQuestion.status400)
  @ApiResponse(sw_createQuestion.status401)
  async createQuestion(@Body() questionInput: QuestionInputModel)
    : Promise<SAQuestionViewModel> {
    const question = await this.commandBus.execute(
      new CreateQuestionCommand(questionInput));
    return question;
  };

  @UseGuards(BasicAuthGuard)
  @HttpCode(HTTP.NO_CONTENT_204)
  @Delete(":id")
  @ApiBasicAuth()
  @ApiOperation(sw_deleteQuestion.summary)
  @ApiResponse(sw_deleteQuestion.status204)
  @ApiResponse(sw_deleteQuestion.status401)
  @ApiResponse(sw_deleteQuestion.status404)
  async deleteQuestion(@Param("id") id: string) {
    await this.commandBus.execute(new DeleteQuestionCommand(id));
  };

  @UseGuards(BasicAuthGuard)
  @HttpCode(HTTP.NO_CONTENT_204)
  @Put(":id")
  @ApiBasicAuth()
  @ApiOperation(sw_updateQuestion.summary)
  @ApiResponse(sw_updateQuestion.status204)
  @ApiResponse(sw_updateQuestion.status400)
  @ApiResponse(sw_updateQuestion.status401)
  @ApiResponse(sw_updateQuestion.status404)
  async updateQuestion(@Param("id") id: string,
                       @Body() questionInput: QuestionInputModel) {
    await this.commandBus.execute(new UpdateQuestionCommand(id, questionInput));
  };

  @UseGuards(BasicAuthGuard)
  @HttpCode(HTTP.NO_CONTENT_204)
  @Put(":id/publish")
  @ApiBasicAuth()
  @ApiOperation(sw_publishQuestion.summary)
  @ApiResponse(sw_publishQuestion.status204)
  @ApiResponse(sw_publishQuestion.status400)
  @ApiResponse(sw_publishQuestion.status401)
  async publishQuestion(@Param("id") id: string,
                        @Body() publishInput: PublishInputModel) {
    await this.commandBus.execute(new PublishQuestionCommand(id, publishInput));
  };
};