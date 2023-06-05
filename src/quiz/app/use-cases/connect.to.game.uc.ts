import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {ForbiddenException, NotFoundException} from "@nestjs/common";
import {v4 as uuidv4} from "uuid";
import {QuizRepository} from "../../inf/quiz.db.repo";
import {QuizQueryRepository} from "../../inf/quiz.q.repo";
import {QuizPlayerProgress} from "../../dom/quiz.player.progress.entity";
import {UserViewModel} from "../../../users/users.types";
import {QuizGame} from "../../dom/quiz.game.entity";

export class ConnectToGameCommand {
  constructor(public user: UserViewModel) {
  };
};

@CommandHandler(ConnectToGameCommand)
export class ConnectToGameUseCase
  implements ICommandHandler<ConnectToGameCommand> {

  constructor(
    protected quizRepository: QuizRepository,
    protected quizQueryRepository: QuizQueryRepository
  ) {
  };

  async execute(command: ConnectToGameCommand) {
    const checkCurrentGame = await this.quizQueryRepository
      .getCurrentGame(command.user.id);

    if (checkCurrentGame) throw new ForbiddenException();

    const pendingGame = await this.quizRepository.getPendingGame();

    if (pendingGame) {
      const secondPlayerProgress = await this.quizRepository
        .getPlayerProgressById(pendingGame.secondPlayerProgressId);
      secondPlayerProgress.playerId = command.user.id;

      pendingGame.startGameDate = new Date().toISOString();
      pendingGame.status = "Active";

      const saveProgress = await this.quizRepository
        .saveProgress(secondPlayerProgress);

      const saveGame = await this.quizRepository.saveGame(pendingGame);

      if (!saveProgress || !saveGame) throw new NotFoundException();

      const newGame = await this.quizQueryRepository.getNewGame(pendingGame.id);
      if (!newGame) throw new NotFoundException();

      return newGame;
    }

    const questions = await this.quizQueryRepository.getRandomQuestionsIds();

    const formatQuestions = questions
      .map(q => ({questionId: q, answerStatus: "Incorrect", addedAt: null}));

    const answers = JSON.stringify(formatQuestions);

    const firstPlayerProgress = new QuizPlayerProgress();

    firstPlayerProgress.id = uuidv4();
    firstPlayerProgress.answers = answers;
    firstPlayerProgress.playerId = command.user.id;

    const secondPlayerProgress = new QuizPlayerProgress();
    secondPlayerProgress.id = uuidv4();
    secondPlayerProgress.answers = answers;

    const game = new QuizGame();
    game.id = uuidv4();
    game.firstPlayerProgressId = firstPlayerProgress.id;
    game.secondPlayerProgressId = secondPlayerProgress.id;
    game.questionsIds = JSON.stringify(questions);
    game.status = "PendingSecondPlayer";
    game.pairCreatedDate = new Date().toISOString();

    firstPlayerProgress.gameId = game.id;
    secondPlayerProgress.gameId = game.id;

    const saveProgress1 = await this.quizRepository
      .saveProgress(firstPlayerProgress);

    const saveProgress2 = await this.quizRepository
      .saveProgress(secondPlayerProgress);

    const saveGame = await this.quizRepository.saveGame(game);

    if (!saveProgress1 || !saveProgress2 || !saveGame)
      throw new NotFoundException();

    const newGame = await this.quizQueryRepository.getNewGame(game.id);
    if (!newGame) throw new NotFoundException();

    return newGame;
  };
};