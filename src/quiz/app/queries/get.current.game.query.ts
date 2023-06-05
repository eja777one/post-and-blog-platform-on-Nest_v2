import {IQueryHandler, QueryBus, QueryHandler} from "@nestjs/cqrs";
import {NotFoundException} from "@nestjs/common";
import {QuizQueryRepository} from "../../inf/quiz.q.repo";
import {GetGameByIdQuery} from "./get.game.query";

export class GetCurrentGameQuery {
  constructor(public userId: string) {
  };
};

@QueryHandler(GetCurrentGameQuery)
export class GetCurrentGameHandler
  implements IQueryHandler<GetCurrentGameQuery> {

  constructor(protected quizQueryRepository: QuizQueryRepository,
              private queryBus: QueryBus) {
  };

  async execute(command: GetCurrentGameQuery) {
    const checkCurrentGame = await this.quizQueryRepository
      .getCurrentGame(command.userId);

    if (!checkCurrentGame) throw new NotFoundException();
    if (checkCurrentGame.status === "Active"
      && checkCurrentGame.finishGameDate !== null
      && new Date().toISOString() > checkCurrentGame.finishGameDate) {

      await this.queryBus.execute(
        new GetGameByIdQuery(command.userId, checkCurrentGame.id))

      throw new NotFoundException();
    }

    const game = await this.quizQueryRepository.getNewGame(checkCurrentGame.id);

    if (!game) throw new NotFoundException();

    return game;
  };
};