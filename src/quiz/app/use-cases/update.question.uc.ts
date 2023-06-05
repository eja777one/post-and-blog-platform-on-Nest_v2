import { BadRequestException, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { QuestionInputModel } from "../../quiz.types";
import { QuizRepository } from "../../inf/quiz.db.repo";
import { makeErorrMessage } from "../../../application/make.error.message";

export class UpdateQuestionCommand {
  constructor(public id: string, public questionInput: QuestionInputModel) {
  };
};

@CommandHandler(UpdateQuestionCommand)
export class UpdateQuestionUseCase
  implements ICommandHandler<UpdateQuestionCommand> {

  constructor(protected quizRepository: QuizRepository) {
  };

  async execute(command: UpdateQuestionCommand) {
    const question = await this.quizRepository.getQuestion(command.id);

    if (!question) throw new NotFoundException();
    if (question.published && JSON.parse(question.correctAnswers).length === 0)
      throw new BadRequestException([makeErorrMessage("body")]);

    const arr1 = [...JSON.parse(question.correctAnswers)];
    const arr2 = [...command.questionInput.correctAnswers];

    if (question.body === command.questionInput.body
      && arr1.sort().toString() === arr2.sort().toString()) return;

    question.body = command.questionInput.body;
    question.correctAnswers = JSON.stringify(command.questionInput.correctAnswers);
    question.updatedAt = new Date().toISOString();

    const updateQuestion = await this.quizRepository.saveQuestion(question);
    if (!updateQuestion) throw new NotFoundException();
  };
};