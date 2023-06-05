import {Injectable} from "@nestjs/common";
import {InjectDataSource, InjectRepository} from "@nestjs/typeorm";
import {DataSource, Not, Repository} from "typeorm";
import {QuizQuestion} from "../dom/quiz.question.entity";
import {errorHandler} from "../../application/error.handler";
import {QuizGame} from "../dom/quiz.game.entity";
import {QuizPlayerProgress} from "../dom/quiz.player.progress.entity";
import {QuizStatistic} from "../dom/quiz.statistic.entity";

@Injectable()
export class QuizRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(QuizQuestion) private readonly quizQuestionRepo:
      Repository<QuizQuestion>,
    @InjectRepository(QuizGame) private readonly quizGameRepo:
      Repository<QuizGame>,
    @InjectRepository(QuizPlayerProgress) private readonly quizPlayerProgressRepo:
      Repository<QuizPlayerProgress>,
    @InjectRepository(QuizStatistic) private readonly quizStatisticRepo:
      Repository<QuizStatistic>
  ) {
  };

  async getStatistic(playerId: string) {
    try {
      const statistic = await this.quizStatisticRepo
        .findOneBy({playerId});
      return statistic;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async saveStatistic(statistic: QuizStatistic) {
    try {
      await this.quizStatisticRepo.save(statistic);
      return true;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getSecondPlayerProgress(playerId: string, gameId: string) {
    try {
      const progress = await this.quizPlayerProgressRepo
        .findOneBy({playerId: Not(playerId), gameId});
      return progress;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getPlayerProgress(playerId: string, game: any) {
    try {
      const progress = await this.quizPlayerProgressRepo.findOneBy([
        {playerId, id: game.firstPlayerProgressId},
        {playerId, id: game.secondPlayerProgressId}
      ]);
      return progress;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getPlayerProgressById(id: string) {
    try {
      const progress = await this.quizPlayerProgressRepo.findOneBy({id});
      return progress;
    } catch (e) {
      return errorHandler(e);
    }
  }

  async getPendingGame() {
    try {
      const game = await this.quizGameRepo.findOneBy(
        {status: "PendingSecondPlayer"});
      return game;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getGame(id: string) {
    try {
      const game = await this.quizGameRepo.findOneBy({id});
      return game;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getQuestion(id: string) {
    try {
      const question = await this.quizQuestionRepo.findOneBy({id});
      return question;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async saveQuestion(question: QuizQuestion) {
    try {
      await this.quizQuestionRepo.save(question);
      return true;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async saveProgress(progress: QuizPlayerProgress) {
    try {
      await this.quizPlayerProgressRepo.save(progress);
      return true;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async saveGame(game: QuizGame) {
    try {
      await this.quizGameRepo.save(game);
      return true;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async deleteQuestion(id: string) {
    try {
      await this.quizQuestionRepo.delete(id);
      return true;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async deleteAllSQL() {
    try {
      await this.dataSource.query(`TRUNCATE "quiz_question", "quiz_game", "quiz_player_progress" CASCADE;`);
      return true;
    } catch (e) {
      return errorHandler(e);
    }
  };
};