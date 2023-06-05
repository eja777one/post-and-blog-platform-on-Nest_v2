import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { QuizQueryRepository } from "../../inf/quiz.q.repo";

export class GetQuestionBySAQuery {
  constructor(public id: string) {
  };
};

@QueryHandler(GetQuestionBySAQuery)
export class GetQuestionBySAHandler
  implements IQueryHandler<GetQuestionBySAQuery> {

  constructor(private readonly quizQueryRepository: QuizQueryRepository) {
  };

  async execute(query: GetQuestionBySAQuery) {
    const questions = await this.quizQueryRepository
      .getViewQuestionSQL(query.id);
    return questions;
  };
};