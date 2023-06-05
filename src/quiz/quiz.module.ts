import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GetQuestionsBySAHandler } from "./app/queries/get.questions.by.sa.query";
import { QuizSAController } from "./api/quiz.sa.controller";
import { QuizQuestion } from "./dom/quiz.question.entity";
import { QuizRepository } from "./inf/quiz.db.repo";
import { QuizQueryRepository } from "./inf/quiz.q.repo";
import { CreateQuestionUseCase } from "./app/use-cases/create.question.uc";
import { DeleteQuestionUseCase } from "./app/use-cases/delete.question.uc";
import { UpdateQuestionUseCase } from "./app/use-cases/update.question.uc";
import { PublishQuestionUseCase } from "./app/use-cases/publish.question.uc";
import { GetCurrentGameHandler } from "./app/queries/get.current.game.query";
import { GetGameByIdHandler } from "./app/queries/get.game.query";
import { ConnectToGameUseCase } from "./app/use-cases/connect.to.game.uc";
import { SendAnswerUseCase } from "./app/use-cases/send.answer.uc";
import { QuizController } from "./api/quiz.controller";
import { QuizGame } from "./dom/quiz.game.entity";
import { QuizPlayerProgress } from "./dom/quiz.player.progress.entity";
import { GetQuestionBySAHandler } from "./app/queries/get.question.by.sa.query";
import { GetUserGamesHandler } from "./app/queries/get.user.games.query";
import { GetUserStatisticHandler } from "./app/queries/get.user.statistic.query";
import { GetTopUsersHandler } from "./app/queries/get.top.users.query";
import { QuizStatistic } from "./dom/quiz.statistic.entity";

const quizAdapters = [QuizRepository, QuizQueryRepository];
const quizUseCases = [CreateQuestionUseCase, DeleteQuestionUseCase,
  UpdateQuestionUseCase, PublishQuestionUseCase, ConnectToGameUseCase,
  SendAnswerUseCase];
const quizQueries = [GetQuestionsBySAHandler, GetCurrentGameHandler,
  GetGameByIdHandler, GetQuestionBySAHandler, GetUserGamesHandler,
  GetUserStatisticHandler, GetTopUsersHandler];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([QuizQuestion, QuizGame, QuizPlayerProgress,
      QuizStatistic])
  ],
  controllers: [QuizSAController, QuizController],
  providers: [
    ...quizAdapters,
    ...quizUseCases,
    ...quizQueries
  ],
  exports: [...quizAdapters]
})
export class QuizModule {
}