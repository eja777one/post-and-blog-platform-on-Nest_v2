import { SkipThrottle } from "@nestjs/throttler";
import { Body, Controller, Get, HttpCode, Param, Post, Query, Req, UseGuards }
  from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { HTTP, Paginator, QueryType, URL } from "../../types";
import {
  AnswerInputModel, AnswerViewModel, GamePairViewModel, MyStatisticViewModel,
  SAQuestionViewModel
} from "../quiz.types";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags }
  from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/guards/jwt.auth.guard";
import { Request } from "express";
import { GetCurrentGameQuery } from "../app/queries/get.current.game.query";
import { GetGameByIdQuery } from "../app/queries/get.game.query";
import { ConnectToGameCommand } from "../app/use-cases/connect.to.game.uc";
import { SendAnswerCommand } from "../app/use-cases/send.answer.uc";
import {
  sw_connectToGame, sw_getCurrentGame, sw_getGameById, sw_getMyGames,
  sw_getMyStatistic, sw_getTopUsers, sw_sendAnswer
} from "./quiz.swagger.info";
import { ApiImplicitQuery }
  from "@nestjs/swagger/dist/decorators/api-implicit-query.decorator";
import { prepareQuizQuery, prepareQuizTopQuery }
  from "../../application/prepare.query";
import { GetUserGamesQuery } from "../app/queries/get.user.games.query";
import { GetUserStatisticQuery } from "../app/queries/get.user.statistic.query";
import { GetTopUsersQuery } from "../app/queries/get.top.users.query";

@ApiTags("PairQuizGame")
@SkipThrottle()
@Controller(URL + "/pair-game-quiz")
export class QuizController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {
  };

  @Get("users/top")
  @ApiImplicitQuery(sw_getTopUsers.sort)
  @ApiImplicitQuery(sw_getTopUsers.pageNumber)
  @ApiImplicitQuery(sw_getTopUsers.pageSize)
  @ApiOperation(sw_getTopUsers.summary)
  @ApiResponse(sw_getTopUsers.status200)
  async getTopUsers(@Query() query: QueryType)
    : Promise<Paginator<MyStatisticViewModel>> {
    const queryForSearch = prepareQuizTopQuery(query);
    const top = await this.queryBus.execute(
      new GetTopUsersQuery(queryForSearch));
    return top;
  };

  @UseGuards(JwtAuthGuard)
  @Get("users/my-statistic")
  @ApiBearerAuth()
  @ApiOperation(sw_getMyStatistic.summary)
  @ApiResponse(sw_getMyStatistic.status200)
  @ApiResponse(sw_getMyStatistic.status401)
  async getMyStatistic(@Req() req: Request): Promise<MyStatisticViewModel> {
    const statistic = await this.queryBus.execute(
      new GetUserStatisticQuery(req.user.id));
    return statistic;
  };

  @UseGuards(JwtAuthGuard)
  @Get("/pairs/my")
  @ApiBearerAuth()
  @ApiImplicitQuery(sw_getMyGames.sortBy)
  @ApiImplicitQuery(sw_getMyGames.sortDirection)
  @ApiImplicitQuery(sw_getMyGames.pageNumber)
  @ApiImplicitQuery(sw_getMyGames.pageSize)
  @ApiOperation(sw_getMyGames.summary)
  @ApiResponse(sw_getMyGames.status200)
  @ApiResponse(sw_getMyGames.status401)
  async getMyGames(@Req() req: Request, @Query() query: QueryType):
    Promise<Paginator<GamePairViewModel>> {
    const queryForSearch = prepareQuizQuery(query);
    const games = await this.queryBus.execute(
      new GetUserGamesQuery(req.user.id, queryForSearch));
    return games;
  };

  @UseGuards(JwtAuthGuard)
  @Get("pairs/my-current")
  @ApiBearerAuth()
  @ApiOperation(sw_getCurrentGame.summary)
  @ApiResponse(sw_getCurrentGame.status200)
  @ApiResponse(sw_getCurrentGame.status401)
  @ApiResponse(sw_getCurrentGame.status404)
  async getCurrentGame(@Req() req: Request): Promise<GamePairViewModel> {
    const game = await this.queryBus.execute(
      new GetCurrentGameQuery(req.user.id));
    return game;
  };

  @UseGuards(JwtAuthGuard)
  @Get("pairs/:id")
  @ApiBearerAuth()
  @ApiOperation(sw_getGameById.summary)
  @ApiResponse(sw_getGameById.status200)
  @ApiResponse(sw_getGameById.status400)
  @ApiResponse(sw_getGameById.status401)
  @ApiResponse(sw_getGameById.status403)
  @ApiResponse(sw_getGameById.status404)
  async getGameById(@Param("id") id: string, @Req() req: Request)
    : Promise<SAQuestionViewModel> {
    const game = await this.queryBus.execute(
      new GetGameByIdQuery(req.user.id, id));
    return game;
  };

  @UseGuards(JwtAuthGuard)
  @HttpCode(HTTP.OK_200)
  @Post("pairs/connection")
  @ApiBearerAuth()
  @ApiOperation(sw_connectToGame.summary)
  @ApiResponse(sw_connectToGame.status200)
  @ApiResponse(sw_connectToGame.status401)
  @ApiResponse(sw_connectToGame.status403)
  async connectToGame(@Req() req: Request): Promise<SAQuestionViewModel> {
    const game = await this.commandBus.execute(
      new ConnectToGameCommand(req.user));
    return game;
  };

  @UseGuards(JwtAuthGuard)
  @HttpCode(HTTP.OK_200)
  @Post("pairs/my-current/answers")
  @ApiBearerAuth()
  @ApiOperation(sw_sendAnswer.summary)
  @ApiResponse(sw_sendAnswer.status200)
  @ApiResponse(sw_sendAnswer.status401)
  @ApiResponse(sw_sendAnswer.status403)
  async sendAnswer(@Req() req: Request, @Body() answerInput: AnswerInputModel)
    : Promise<AnswerViewModel> {
    const answer = await this.commandBus.execute(
      new SendAnswerCommand(req.user.id, answerInput));
    return answer;
  };
};