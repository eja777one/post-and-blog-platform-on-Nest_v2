import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {ForbiddenException, NotFoundException} from "@nestjs/common";
import {AnswerInputModel} from "../../quiz.types";
import {QuizRepository} from "../../inf/quiz.db.repo";
import {QuizQueryRepository} from "../../inf/quiz.q.repo";
import {QuizStatistic} from "../../dom/quiz.statistic.entity";
import {QuizPlayerProgress} from "../../dom/quiz.player.progress.entity";

export class SendAnswerCommand {
  constructor(public userId: string, public answerInput: AnswerInputModel) {
  };
};

@CommandHandler(SendAnswerCommand)
export class SendAnswerUseCase
  implements ICommandHandler<SendAnswerCommand> {

  constructor(
    protected quizRepository: QuizRepository,
    protected quizQueryRepository: QuizQueryRepository
  ) {
  };

  async execute(command: SendAnswerCommand) {
    const currentGame = await this.quizQueryRepository
      .getActiveGame(command.userId);

    if (!currentGame) throw new ForbiddenException();

    const playerProgress = await this.quizRepository.getPlayerProgress(
      command.userId, currentGame);

    const otherPlayerProgress = await this.quizRepository
      .getSecondPlayerProgress(command.userId, currentGame.id);

    if (!playerProgress || !otherPlayerProgress) throw new NotFoundException();

    let index = 100;
    const answers = JSON.parse(playerProgress.answers);

    if (!currentGame.finishGameDate
      || new Date().toISOString() < currentGame.finishGameDate) {

      for (let i = 0; i < answers.length; i++) {
        if (answers[i].addedAt === null) {
          index = i;
          break;
        }
      }

      if (index > 4) throw new ForbiddenException();

      const question = await this.quizRepository.getQuestion(
        answers[index].questionId);

      const correctAnswers = JSON.parse(question.correctAnswers);

      answers[index].addedAt = new Date().toISOString();

      if (correctAnswers.find(el => el === command.answerInput.answer)) {
        answers[index].answerStatus = "Correct";
        playerProgress.score += 1;
      }

    } else if (currentGame.finishGameDate
      && new Date().toISOString() > currentGame.finishGameDate) {

      for (let i = 0; i < answers.length; i++) {
        if (answers[i].addedAt !== null) continue;
        answers[i].addedAt = currentGame.finishGameDate;
      }

      index = 4;
    }

    playerProgress.answers = JSON.stringify(answers);

    const saveProgress = await this.quizRepository.saveProgress(playerProgress);
    if (!saveProgress) throw new NotFoundException();

    if (otherPlayerProgress.answers.indexOf("null") > 0 && index === 4) {
      const date = new Date();
      date.setSeconds(date.getSeconds() + 10);
      currentGame.finishGameDate = date.toISOString();
    }

    if (otherPlayerProgress.answers.indexOf("null") === -1 && index === 4) {
      currentGame.status = "Finished";

      const isCorrectAnswer = otherPlayerProgress.answers.indexOf("Correct");

      if (isCorrectAnswer > -1) {
        otherPlayerProgress.score += 1;
        const saveProgress = await this.quizRepository
          .saveProgress(otherPlayerProgress);
        if (!saveProgress) throw new NotFoundException();
      }

      const saveFirstStatistic = await this
        .recordStatistic(playerProgress, otherPlayerProgress);

      if (!saveFirstStatistic) throw new NotFoundException();

      const saveSecondStatistic = await this
        .recordStatistic(otherPlayerProgress, playerProgress);

      if (!saveSecondStatistic) throw new NotFoundException();
    }

    const saveGame = await this.quizRepository.saveGame(currentGame);
    if (!saveGame) throw new NotFoundException();

    return answers[index];
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