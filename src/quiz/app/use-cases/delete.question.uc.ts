import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { NotFoundException } from "@nestjs/common";
import { QuizRepository } from "../../inf/quiz.db.repo";
import { QuizQueryRepository } from "../../inf/quiz.q.repo";

export class DeleteQuestionCommand {
  constructor(public id: string) {
  };
};

@CommandHandler(DeleteQuestionCommand)
export class DeleteQuestionUseCase
  implements ICommandHandler<DeleteQuestionCommand> {

  constructor(
    protected quizRepository: QuizRepository,
    protected quizQueryRepository: QuizQueryRepository
  ) {
  };

  async execute(command: DeleteQuestionCommand) {
    const question = await this.quizQueryRepository
      .getViewQuestionSQL(command.id);
    if (!question) throw new NotFoundException();

    const deleted = await this.quizRepository.deleteQuestion(command.id);
    if (!deleted) throw new NotFoundException();
  };
};