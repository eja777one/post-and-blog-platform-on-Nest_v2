import {Injectable} from "@nestjs/common";
import {InjectDataSource} from "@nestjs/typeorm";
import {DataSource} from "typeorm";
import {Paginator, QueryType} from "../../types";
import {GamePairViewModel, MyStatisticViewModel, SAQuestionViewModel, TopUserViewModel} from "../quiz.types";
import {errorHandler} from "../../application/error.handler";
import {QuizQuestion} from "../dom/quiz.question.entity";
import {QuizGame} from "../dom/quiz.game.entity";
import {QuizPlayerProgress} from "../dom/quiz.player.progress.entity";
import {Users} from "../../users/dom/users.entity";
import {QuizStatistic} from "../dom/quiz.statistic.entity";
import {ApiProperty} from "@nestjs/swagger";

@Injectable()
export class QuizQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {
  };

  async getTopUsers(queryForSearch: QueryType)
    : Promise<Paginator<TopUserViewModel>> {
    try {
      const skip = ((queryForSearch.pageNumber - 1) * queryForSearch.pageSize);
      // console.log(queryForSearch.sort);
      let query = this.dataSource
        .getRepository(QuizStatistic)
        .createQueryBuilder("qs")
        .innerJoinAndMapOne("qs.user", Users, "u",
          "qs.playerId = u.id")

      const statisticsCount = await query.getCount();

      for (let i = 0; i < queryForSearch.sort.length; i++) {
        const temp = queryForSearch.sort[i].split(" ");
        const sortBy = temp[0];
        const sortDirection = temp[1];

        if (i === 0) {
          //@ts-ignore
          query = query.orderBy(`qs.${sortBy}`, sortDirection);
        } else {
          //@ts-ignore
          query = query.addOrderBy(`qs.${sortBy}`, sortDirection);
        }
      }

      const statistics = await query
        .limit(queryForSearch.pageSize)
        .offset(skip)
        .getMany();

      return {
        pagesCount: Math.ceil(statisticsCount / queryForSearch.pageSize),
        page: queryForSearch.pageNumber,
        pageSize: queryForSearch.pageSize,
        totalCount: statisticsCount,
        items: statistics.length > 0 ? statistics.map(el => formatStatic(el)) : []
      };
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getStatistic(userId: string) {
    try {
      // const games = await this.dataSource
      //   .getRepository(QuizGame)
      //   .createQueryBuilder("qg")
      //   .leftJoinAndMapOne("qg.firstPlayer", QuizPlayerProgress,
      //     "fp", "fp.id = qg.firstPlayerProgressId")
      //   .leftJoinAndMapOne("qg.secondPlayer", QuizPlayerProgress,
      //     "sp", "sp.id = qg.secondPlayerProgressId")
      //   .leftJoinAndMapOne("qg.firstPlayerInfo", Users,
      //     "fpi", "fp.playerId = fpi.id")
      //   .leftJoinAndMapOne("qg.secondPlayerInfo", Users,
      //     "spi", "sp.playerId = spi.id")
      //   .where("fp.playerId = :id OR sp.playerId = :id", { id: userId })
      //   .getMany();
      //
      // return formatStatistic(games, userId);

      const statistic = await this.dataSource
        .getRepository(QuizStatistic)
        .createQueryBuilder("qs")
        .select("qs.sumScore", "sumScore")
        .addSelect("qs.avgScores", "avgScores")
        .addSelect("qs.gamesCount", "gamesCount")
        .addSelect("qs.winsCount", "winsCount")
        .addSelect("qs.lossesCount", "lossesCount")
        .addSelect("qs.drawsCount", "drawsCount")
        .where("qs.playerId = :userId", {userId})
        .getRawOne();

      return statistic;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getUserGames(userId: string, queryForSearch: QueryType)
    : Promise<Paginator<GamePairViewModel>> {
    try {
      const skip = ((queryForSearch.pageNumber - 1) * queryForSearch.pageSize);

      const query = this.dataSource
        .getRepository(QuizGame)
        .createQueryBuilder("qg")
        .leftJoinAndMapOne("qg.firstPlayer", QuizPlayerProgress,
          "fp", "fp.id = qg.firstPlayerProgressId")
        .leftJoinAndMapOne("qg.secondPlayer", QuizPlayerProgress,
          "sp", "sp.id = qg.secondPlayerProgressId")
        .leftJoinAndMapOne("qg.firstPlayerInfo", Users,
          "fpi", "fp.playerId = fpi.id")
        .leftJoinAndMapOne("qg.secondPlayerInfo", Users,
          "spi", "sp.playerId = spi.id")
        .where("fp.playerId = :id OR sp.playerId = :id", {id: userId});

      const gamesCount = await query.getCount();

      const games = await query
        .orderBy(`qg.${queryForSearch.sortBy} COLLATE "C"`,
          queryForSearch.sortDirection)
        .addOrderBy("qg.pairCreatedDate COLLATE \"C\"", "DESC")
        .limit(queryForSearch.pageSize)
        .offset(skip)
        .getMany();

      // console.log(games);

      const rawQuestions = await this.dataSource
        .getRepository(QuizQuestion)
        .createQueryBuilder("qq")
        .getMany();

      return {
        pagesCount: Math.ceil(gamesCount / queryForSearch.pageSize),
        page: queryForSearch.pageNumber,
        pageSize: queryForSearch.pageSize,
        totalCount: gamesCount,
        items: games.map(game => formatGame(game, undefined, rawQuestions))
      };
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getNewGame(id: string): Promise<GamePairViewModel> {
    try {
      const game = await this.dataSource
        .getRepository(QuizGame)
        .createQueryBuilder("qg")
        .leftJoinAndMapOne("qg.firstPlayer", QuizPlayerProgress,
          "fp", "fp.id = qg.firstPlayerProgressId")
        .leftJoinAndMapOne("qg.secondPlayer", QuizPlayerProgress,
          "sp", "sp.id = qg.secondPlayerProgressId")
        .leftJoinAndMapOne("qg.firstPlayerInfo", Users,
          "fpi", "fp.playerId = fpi.id")
        .leftJoinAndMapOne("qg.secondPlayerInfo", Users,
          "spi", "sp.playerId = spi.id")
        .where("qg.id = :id", {id})
        .getOne();

      if (!game) return null;

      const questionsIds = JSON.parse(game.questionsIds);

      const rawQuestions = await this.dataSource
        .getRepository(QuizQuestion)
        .createQueryBuilder("qq")
        .where("qq.id = ANY(:ids)", {ids: questionsIds})
        .getMany();

      const questions = [];

      for (let i = 0; i < questionsIds.length; i++) {
        const q = rawQuestions.find(el => el.id === questionsIds[i]);
        questions.push(q);
      }

      return game ? formatGame(game, questions) : null;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getRandomQuestionsIds() {
    try {
      const questions = await this.dataSource
        .getRepository(QuizQuestion)
        .createQueryBuilder("qq")
        .orderBy("RANDOM()")
        .take(5)
        .getMany();

      return questions.map(el => el.id);
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getCurrentGame(userId: string) {
    try {
      const game = await this.dataSource
        .getRepository(QuizGame)
        .createQueryBuilder("qg")
        .leftJoinAndMapOne("qg.firstPlayer", QuizPlayerProgress,
          "fp", "fp.id = qg.firstPlayerProgressId")
        .leftJoinAndMapOne("qg.secondPlayer", QuizPlayerProgress,
          "sp", "sp.id = qg.secondPlayerProgressId")
        .where("(fp.playerId = :id OR sp.playerId = :id) AND " +
          "(qg.status = 'Active' OR qg.status = 'PendingSecondPlayer')",
          {id: userId})
        .getOne();

      return game;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getActiveGame(userId: string) {
    try {
      const game = await this.dataSource
        .getRepository(QuizGame)
        .createQueryBuilder("qg")
        .leftJoinAndMapOne("qg.firstPlayer", QuizPlayerProgress,
          "fp", "fp.id = qg.firstPlayerProgressId")
        .leftJoinAndMapOne("qg.secondPlayer", QuizPlayerProgress,
          "sp", "sp.id = qg.secondPlayerProgressId")
        .where("(fp.playerId = :id OR sp.playerId = :id) AND " +
          "qg.status = 'Active'", {id: userId})
        .getOne();

      return game;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getViewQuestionSQL(id: string): Promise<SAQuestionViewModel> | null {
    try {
      const question = await this.dataSource
        .getRepository(QuizQuestion)
        .createQueryBuilder("qq")
        .where("qq.id = :id", {id})
        .getOne();
      return question ? formatQuestion(question) : null;
    } catch (e) {
      return errorHandler(e);
    }
  };

  // async getQuestionSQL(body: string) {
  //   try {
  //     const question = await this.dataSource
  //       .getRepository(QuizQuestion)
  //       .createQueryBuilder("qq")
  //       .where("LOWER(qq.body) LIKE LOWER(:body)", { body })
  //       .getOne();
  //     return question;
  //   } catch (e) {
  //     return errorHandler(e);
  //   }
  // };

  async getQuestionsBySASQL(queryForSearch: QueryType)
    : Promise<Paginator<SAQuestionViewModel>> {

    let published = "%";

    if (queryForSearch.publishedStatus === "published") published = "true";
    else if (queryForSearch.publishedStatus === "notPublished")
      published = "false";

    const bodyTerm = queryForSearch.bodySearchTerm ?
      `%${queryForSearch.bodySearchTerm}%` : `%%`;

    const skip = ((queryForSearch.pageNumber - 1) * queryForSearch.pageSize);

    try {
      const query = this.dataSource
        .getRepository(QuizQuestion)
        .createQueryBuilder("qq")
        .where("LOWER(qq.body) LIKE LOWER(:bodyTerm) AND" +
          "(CASE WHEN qq.published = true THEN 'true' ELSE 'false' END)" +
          "LIKE (:published)", {bodyTerm, published});

      const questionCount = await query.getCount();

      const questions = await query
        .orderBy(`qq.${queryForSearch.sortBy} COLLATE "C"`,
          queryForSearch.sortDirection)
        .limit(queryForSearch.pageSize)
        .offset(skip)
        .getMany();

      return {
        pagesCount: Math.ceil(questionCount / queryForSearch.pageSize),
        page: queryForSearch.pageNumber,
        pageSize: queryForSearch.pageSize,
        totalCount: questionCount,
        items: questions.map(rq => formatQuestion(rq))
      };
    } catch (e) {
      return errorHandler(e);
    }
  };
};

// const formatStatistic = (games: any, userId: string) => {
//   const statistic = new MyStatisticViewModel;
//
//   for (let game of games) {
//
//     const userScore = game.firstPlayer.playerId === userId ?
//       game.firstPlayer.score : game.secondPlayer.score;
//
//     const enemyScore = game.firstPlayer.playerId !== userId ?
//       game.firstPlayer.score : game.secondPlayer.score;
//
//     if (userScore === enemyScore) statistic.drawsCount++;
//     if (userScore > enemyScore) statistic.winsCount++;
//     if (userScore < enemyScore) statistic.lossesCount++;
//
//     statistic.gamesCount++;
//     statistic.sumScore += userScore;
//     statistic.avgScores = statistic.sumScore / statistic.gamesCount;
//   }
//
//   if (statistic.avgScores.toString().indexOf(".") !== -1) {
//     const temp = statistic.avgScores.toFixed(2);
//     statistic.avgScores = +temp;
//   }
//
//   return statistic;
// };

const formatStatic = (statistic: any): TopUserViewModel => {
  return {
    sumScore: statistic.sumScore,
    avgScores: statistic.avgScores,
    gamesCount: statistic.gamesCount,
    winsCount: statistic.winsCount,
    lossesCount: statistic.lossesCount,
    drawsCount: statistic.drawsCount,
    player: {
      id: statistic.playerId,
      login: statistic.user.login
    }
  };
};

const formatQuestion = (rawQuestion: any): SAQuestionViewModel => {
  return {
    id: rawQuestion.id,
    body: rawQuestion.body,
    published: rawQuestion.published,
    createdAt: rawQuestion.createdAt,
    updatedAt: rawQuestion.updatedAt,
    correctAnswers: JSON.parse(rawQuestion.correctAnswers)
  };
};

const formatGame = (game: any, questions?: any, rawQuestions?: any): GamePairViewModel => {

  const firstPlayerAns = JSON.parse(game.firstPlayer.answers);
  const firstPlayerAnswers = firstPlayerAns.filter(ans => ans.addedAt !== null);

  let secondPlayerAnswers = JSON.parse(game.secondPlayer.answers);
  secondPlayerAnswers = secondPlayerAnswers.filter(ans => ans.addedAt !== null);

  const tempQuestions = [];

  if (rawQuestions) {
    for (let ans of firstPlayerAns) {
      tempQuestions.push(rawQuestions.find(rq => rq.id === ans.questionId));
    }
  }

  const quest = rawQuestions ? tempQuestions : questions;

  const secondPlayerProgress = {
    answers: secondPlayerAnswers,
    player: {
      id: game.secondPlayerInfo?.id ? game.secondPlayerInfo?.id : null,
      login: game.secondPlayerInfo?.login ? game.secondPlayerInfo?.login : null
    },
    score: game.secondPlayer.score
  };

  return {
    id: game.id,
    firstPlayerProgress: {
      answers: firstPlayerAnswers,
      player: {
        id: game.firstPlayerInfo.id,
        login: game.firstPlayerInfo.login
      },
      score: game.firstPlayer.score
    },
    secondPlayerProgress: game.status === "PendingSecondPlayer" ? null : secondPlayerProgress,
    questions: game.status === "PendingSecondPlayer" ? null : quest.map(q => ({id: q.id, body: q.body})),
    status: game.status,
    pairCreatedDate: game.pairCreatedDate,
    startGameDate: game.startGameDate,
    finishGameDate: game.status === "Finished" ? game.finishGameDate : null
  };
};