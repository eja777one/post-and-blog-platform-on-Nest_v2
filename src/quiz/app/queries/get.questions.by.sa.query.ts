import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { QueryType } from "../../../types";
import { QuizQueryRepository } from "../../inf/quiz.q.repo";

export class GetQuestionsBySAQuery {
  constructor(public queryForSearch: QueryType) {
  };
};

@QueryHandler(GetQuestionsBySAQuery)
export class GetQuestionsBySAHandler
  implements IQueryHandler<GetQuestionsBySAQuery> {

  constructor(private readonly quizQueryRepository: QuizQueryRepository) {
  };

  async execute(query: GetQuestionsBySAQuery) {
    const questions = await this.quizQueryRepository
      .getQuestionsBySASQL(query.queryForSearch);
    return questions;
  };
};