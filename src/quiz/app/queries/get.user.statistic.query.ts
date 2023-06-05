import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { NotFoundException } from "@nestjs/common";
import { QuizQueryRepository } from "../../inf/quiz.q.repo";

export class GetUserStatisticQuery {
  constructor(public userId: string) {
  };
};

@QueryHandler(GetUserStatisticQuery)
export class GetUserStatisticHandler
  implements IQueryHandler<GetUserStatisticQuery> {

  constructor(protected quizQueryRepository: QuizQueryRepository) {
  };

  async execute(command: GetUserStatisticQuery) {
    const statistic = await this.quizQueryRepository
      .getStatistic(command.userId);

    if (!statistic) throw new NotFoundException();

    return statistic;
  };
};