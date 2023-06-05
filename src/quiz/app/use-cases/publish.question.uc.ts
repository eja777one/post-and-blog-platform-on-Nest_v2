import { BadRequestException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PublishInputModel } from "../../quiz.types";
import { QuizRepository } from "../../inf/quiz.db.repo";
import { makeErorrMessage } from "../../../application/make.error.message";

export class PublishQuestionCommand {
  constructor(public id: string, public publishInput: PublishInputModel) {
  };
};

@CommandHandler(PublishQuestionCommand)
export class PublishQuestionUseCase
  implements ICommandHandler<PublishQuestionCommand> {

  constructor(protected quizRepository: QuizRepository) {
  };

  async execute(command: PublishQuestionCommand) {
    const question = await this.quizRepository.getQuestion(command.id);

    if (!question) throw new NotFoundException();
    if (JSON.parse(question.correctAnswers).length === 0)
      throw new BadRequestException([makeErorrMessage("published")]);
    if (question.published === command.publishInput.published) return;

    question.published = command.publishInput.published;
    question.updatedAt = new Date().toISOString();

    const updateQuestion = await this.quizRepository.saveQuestion(question);
    if (!updateQuestion) throw new NotFoundException();
  };
};