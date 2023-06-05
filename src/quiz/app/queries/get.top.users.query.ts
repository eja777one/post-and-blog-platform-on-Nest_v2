import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { NotFoundException } from "@nestjs/common";
import { QuizQueryRepository } from "../../inf/quiz.q.repo";
import { QueryType } from "../../../types";

export class GetTopUsersQuery {
  constructor(public query: QueryType) {
  };
};

@QueryHandler(GetTopUsersQuery)
export class GetTopUsersHandler
  implements IQueryHandler<GetTopUsersQuery> {

  constructor(protected quizQueryRepository: QuizQueryRepository) {
  };

  async execute(command: GetTopUsersQuery) {
    const topUsers = await this.quizQueryRepository
      .getTopUsers(command.query);

    if (!topUsers) throw new NotFoundException();

    return topUsers;
  };
};