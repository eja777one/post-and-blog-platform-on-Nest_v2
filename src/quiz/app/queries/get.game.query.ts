import {IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import {BadRequestException, ForbiddenException, NotFoundException} from "@nestjs/common";
import {QuizQueryRepository} from "../../inf/quiz.q.repo";
import {makeErorrMessage} from "../../../application/make.error.message";
import {validate as isValidUUID} from "uuid";
import {QuizRepository} from "../../inf/quiz.db.repo";
import {QuizPlayerProgress} from "../../dom/quiz.player.progress.entity";
import {QuizStatistic} from "../../dom/quiz.statistic.entity";

export class GetGameByIdQuery {
  constructor(public userId: string, public gameId: string) {
  };
};

@QueryHandler(GetGameByIdQuery)
export class GetGameByIdHandler implements IQueryHandler<GetGameByIdQuery> {

  constructor(
    protected quizQueryRepository: QuizQueryRepository,
    protected quizRepository: QuizRepository,

  ) {
  };

  async execute(command: GetGameByIdQuery) {
    if (!isValidUUID(command.gameId)) throw new BadRequestException(
      [makeErorrMessage("id")]);

    const rawGame = await this.quizRepository.getGame(command.gameId);
    if (!rawGame) throw new NotFoundException();

    // console.log(rawGame)

    if (rawGame.status === "Active" && rawGame.finishGameDate !== null
    && new Date().toISOString() > rawGame.finishGameDate) {
      const firstPlayerProgress = await this.quizRepository
        .getPlayerProgressById(rawGame.firstPlayerProgressId);

      const secondPlayerProgress = await this.quizRepository
        .getPlayerProgressById(rawGame.secondPlayerProgressId);

      if (!this.isAllQuestionAnswered(firstPlayerProgress)) {
        await this.answerAllQuestion(firstPlayerProgress, rawGame.finishGameDate);
        await this.addBonus(secondPlayerProgress);
      } else {
        await this.answerAllQuestion(secondPlayerProgress, rawGame.finishGameDate);
        await this.addBonus(firstPlayerProgress);
      }

      const saveFirstStatistic = await this
        .recordStatistic(firstPlayerProgress, secondPlayerProgress);

      if (!saveFirstStatistic) throw new NotFoundException();

      const saveSecondStatistic = await this
        .recordStatistic(secondPlayerProgress, firstPlayerProgress);

      if (!saveSecondStatistic) throw new NotFoundException();

      rawGame.status = 'Finished';
      const saveGame = await this.quizRepository.saveGame(rawGame);
      if(!saveGame) throw new NotFoundException();

      // console.log(rawGame)
    }

    const game = await this.quizQueryRepository.getNewGame(command.gameId);
    if (!game) throw new NotFoundException();

    // console.log(game);

    if (
      game.firstPlayerProgress.player.id !== command.userId
      && game.secondPlayerProgress?.player?.id !== command.userId
    ) throw new ForbiddenException();

    return game;
  };

  isAllQuestionAnswered(progress: QuizPlayerProgress): boolean {
    return progress.answers.indexOf('null') === -1;
  }

  async answerAllQuestion(progress: QuizPlayerProgress, date: string) {
    const answers = JSON.parse(progress.answers);
    for (let i = 0; i < answers.length; i++) {
      if (answers[i].addedAt === null) answers[i].addedAt = date;
    }
    progress.answers = JSON.stringify(answers);

    const save = await this.quizRepository.saveProgress(progress);
    if (!save) throw new NotFoundException();
  }

  async addBonus(progress: QuizPlayerProgress) {
    if (progress.answers.indexOf('Correct') === -1) return;
    progress.score += 1;
    const save = await this.quizRepository.saveProgress(progress);
    if (!save) throw new NotFoundException();
  }

  async recordStatistic(playerProgress: QuizPlayerProgress,
                        otherPlayerProgress: QuizPlayerProgress) {
    const playerStatistic = await this.quizRepository
      .getStatistic(playerProgress.playerId);

    if (!playerStatistic) {
      const statistic = new QuizStatistic();
      statistic.playerId = playerProgress.playerId;

      const game = JSON.stringify([playerProgress.gameId]);
      statistic.gameIds = game;

      statistic.sumScore = playerProgress.score;
      statistic.avgScores = playerProgress.score / 1;
      statistic.gamesCount = 1;

      if (playerProgress.score > otherPlayerProgress.score) {
        statistic.winsCount = 1;
      } else if (playerProgress.score < otherPlayerProgress.score) {
        statistic.lossesCount = 1;
      } else statistic.drawsCount = 1;

      const saveStatistic = await this.quizRepository.saveStatistic(statistic);
      if (!saveStatistic) return null;
      return true;
    }

    const game = JSON.parse(playerStatistic.gameIds);
    game.push(playerProgress.gameId);
    playerStatistic.gameIds = JSON.stringify(game);

    playerStatistic.sumScore += playerProgress.score;
    playerStatistic.gamesCount += 1;
    playerStatistic.avgScores = playerStatistic.sumScore / playerStatistic.gamesCount;

    if (playerStatistic.avgScores.toString().indexOf(".") !== -1) {
      const temp = playerStatistic.avgScores.toFixed(2);
      playerStatistic.avgScores = +temp;
    }

    if (playerProgress.score > otherPlayerProgress.score) {
      playerStatistic.winsCount++;
    } else if (playerProgress.score < otherPlayerProgress.score) {
      playerStatistic.lossesCount++;
    } else playerStatistic.drawsCount++;

    const saveStatistic = await this.quizRepository.saveStatistic(playerStatistic);
    if (!saveStatistic) return null;
    return true;
  }
};