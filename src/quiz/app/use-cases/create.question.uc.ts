import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { QuestionInputModel } from "../../quiz.types";
import { QuizRepository } from "../../inf/quiz.db.repo";
import { QuizQueryRepository } from "../../inf/quiz.q.repo";
import { makeErorrMessage } from "../../../application/make.error.message";
import { QuizQuestion } from "../../dom/quiz.question.entity";

export class CreateQuestionCommand {
  constructor(public body: QuestionInputModel) {
  };
};

@CommandHandler(CreateQuestionCommand)
export class CreateQuestionUseCase
  implements ICommandHandler<CreateQuestionCommand> {

  constructor(
    protected quizRepository: QuizRepository,
    protected quizQueryRepository: QuizQueryRepository
  ) {
  };

  async execute(command: CreateQuestionCommand) {
    // const isQuestionExist = await this.quizQueryRepository
    //   .getQuestionSQL(command.body.body);
    //
    // if (isQuestionExist) throw new BadRequestException(
    //   [makeErorrMessage("body")]);q

    const question = new QuizQuestion();
    question.id = uuidv4();
    question.body = command.body.body;
    question.createdAt = new Date().toISOString();
    question.correctAnswers = JSON.stringify(command.body.correctAnswers);

    const saveQuestion = await this.quizRepository.saveQuestion(question);
    if (!saveQuestion) throw new NotFoundException();

    const newQuestion = await this.quizQueryRepository
      .getViewQuestionSQL(question.id);
    if (!newQuestion) throw new NotFoundException();

    return newQuestion;
  };
};