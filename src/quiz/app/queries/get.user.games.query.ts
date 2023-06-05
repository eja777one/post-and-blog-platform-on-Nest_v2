import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { NotFoundException } from "@nestjs/common";
import { QuizQueryRepository } from "../../inf/quiz.q.repo";
import { QueryType } from "../../../types";

export class GetUserGamesQuery {
  constructor(public userId: string, public queryForSearch: QueryType) {
  };
};

@QueryHandler(GetUserGamesQuery)
export class GetUserGamesHandler
  implements IQueryHandler<GetUserGamesQuery> {

  constructor(protected quizQueryRepository: QuizQueryRepository) {
  };

  async execute(command: GetUserGamesQuery) {
    const games = await this.quizQueryRepository
      .getUserGames(command.userId, command.queryForSearch);

    if (!games) throw new NotFoundException();

    return games;
  };
};