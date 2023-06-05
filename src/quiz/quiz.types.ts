import { IsArray, IsBoolean, IsString, Length } from "class-validator";
import { makeErorrMessage } from "../application/make.error.message";
import { Transform, TransformFnParams } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { sw_Paginator } from "../types";
import { BlogViewModel } from "../blogs/blogs.types";

export class SAQuestionViewModel {
  @ApiProperty({
    description: "Question's id",
    nullable: false,
    example: "9627e52f-7246-4299-823c-2784537a6430"
  })
  id: string;
  @ApiProperty({
    description: "Question's body",
    nullable: false,
    example: "How many hands mans have?"
  })
  body: string;
  @ApiProperty({
    description: "Question's correct answers",
    nullable: false,
    example: ["Two", "2", "One pair"]
  })
  correctAnswers: string[];
  @ApiProperty({
    description: "Question's published status",
    nullable: false,
    example: false
  })
  published: boolean;
  @ApiProperty({
    description: "Question's created at date",
    nullable: false,
    example: "2023-05-16T10:30:54.443Z"
  })
  createdAt: string;
  @ApiProperty({
    description: "Question's updated at date",
    nullable: false,
    example: "2023-05-16T10:30:54.443Z"
  })
  updatedAt: string;
};

export class QuestionInputModel {
  @ApiProperty({
    description: "Question's body",
    nullable: false,
    minLength: 10,
    maxLength: 500,
    example: "How many hands mans have?"
  })
  @IsString(makeErorrMessage("body"))
  @Length(10, 500, makeErorrMessage("body"))
  @Transform(({ value }: TransformFnParams) => value?.trim())
  body: string;

  @ApiProperty({
    description: "Question's correct answers",
    nullable: false,
    example: ["Two", "2", "One pair"]
  })
  @IsArray(makeErorrMessage("correctAnswers"))
  @IsString({ each: true })
  correctAnswers: string[];
}

export class AnswerInputModel {
  @ApiProperty({
    description: "User's answer",
    nullable: false,
    example: "Two"
  })
  answer: string;
}

export class PublishInputModel {
  @ApiProperty({
    description: "Question's published status",
    nullable: false,
    example: true
  })
  @IsBoolean(makeErorrMessage("published"))
  published: boolean;
};

export class sw_Paginator_SAQuestionViewModel extends sw_Paginator {
  @ApiProperty({
    description: "Items",
    nullable: false,
    isArray: true,
    type: SAQuestionViewModel
  })
  @ApiProperty()
  items: SAQuestionViewModel[];
};

export class AnswerViewModel {
  @ApiProperty({
    description: "Question's id",
    nullable: false,
    example: "9627e52f-7246-4299-823c-2784537a6430"
  })
  questionId: string;
  @ApiProperty({
    description: "Question's answerStatus",
    nullable: false,
    example: "Correct"
  })
  answerStatus: AnswerStatus;
  @ApiProperty({
    description: "Answer's added at date ",
    nullable: false,
    example: "2023-05-16T10:30:54.443Z"
  })
  addedAt: string;
};

export type AnswerStatus = "Correct" | "Incorrect";

export class Player {
  @ApiProperty({
    description: "Player's info",
    nullable: false,
    example: "f0da849d-4ff9-4d36-905c-9e8eb3d7a3c3"
  })
  id: string;
  @ApiProperty({
    description: "Player's login",
    nullable: false,
    example: "eja777one"
  })
  login: string;
};

export class QuestionViewModel {
  @ApiProperty({
    description: "Question's id",
    nullable: false,
    example: "35292742-e397-4db4-9318-c5d866ada2ed"
  })
  id: string;
  @ApiProperty({
    description: "Question's body",
    nullable: false,
    example: "How many hands mans have?"
  })
  body: string;
};

export type GameStatuses = "PendingSecondPlayer" | "Active" | "Finished";

export class GamePlayerProgressViewModel {
  @ApiProperty({
    description: "Player's answers",
    nullable: false,
    isArray: true,
    type: AnswerViewModel
  })
  answers: AnswerViewModel[];
  @ApiProperty({
    description: "Player's info",
    nullable: false,
    type: Player
  })
  player: Player;
  @ApiProperty({
    description: "Player's score",
    nullable: false,
    example: 0
  })
  score: number;
}

export class GamePairViewModel {
  @ApiProperty({
    description: "Game pair id",
    nullable: false,
    example: "68572be5-becc-4f87-8644-8e63f06927cf"
  })
  id: string;
  @ApiProperty({
    description: "First player progress",
    nullable: false,
    type: GamePlayerProgressViewModel
  })
  firstPlayerProgress: GamePlayerProgressViewModel;
  @ApiProperty({
    description: "Second player progress",
    nullable: false,
    type: GamePlayerProgressViewModel
  })
  secondPlayerProgress: GamePlayerProgressViewModel;
  @ApiProperty({
    description: "Game's questions",
    nullable: false,
    isArray: true,
    type: QuestionViewModel
  })
  questions: QuestionViewModel[];
  @ApiProperty({
    description: "Game's status",
    nullable: false,
    example: "Active"
  })
  status: GameStatuses;
  @ApiProperty({
    description: "Game's created date (when first player connect)",
    nullable: false,
    example: "2023-05-17T04:35:34.471Z"
  })
  pairCreatedDate: string;
  @ApiProperty({
    description: "Game's started date (when second player connect)",
    nullable: true,
    example: "2023-05-17T04:35:34.471Z"
  })
  startGameDate: string;
  @ApiProperty({
    description: "Game's finished date (when all players answered all questions)",
    nullable: true,
    example: "2023-05-17T04:35:34.471Z"
  })
  finishGameDate: string;
};

export class sw_Paginator_GamePairViewModel extends sw_Paginator {
  @ApiProperty({
    description: "Items",
    nullable: false,
    isArray: true,
    type: GamePairViewModel
  })
  @ApiProperty()
  items: GamePairViewModel[];
}

export class MyStatisticViewModel {
  @ApiProperty({
    description: "Sum scores of all games",
    nullable: false,
    example: 4
  })
  sumScore: number = 0;
  @ApiProperty({
    description: "Average score of all games rounded to 2 decimal places",
    nullable: false,
    example: 1.33
  })
  avgScores: number = 0;
  @ApiProperty({
    description: "All played games count",
    nullable: false,
    example: 3
  })
  gamesCount: number = 0;
  @ApiProperty({
    description: "winsCount",
    nullable: false,
    example: 1
  })
  winsCount: number = 0;
  @ApiProperty({
    description: "lossesCount",
    nullable: false,
    example: 2
  })
  lossesCount: number = 0;
  @ApiProperty({
    description: "drawsCount",
    nullable: false,
    example: 0
  })
  drawsCount: number = 0;
}

export class TopUserViewModel extends MyStatisticViewModel {
  @ApiProperty({
    description: "player",
    nullable: false,
    type: Player
  })
  player: Player;
};

export class sw_Paginator_TopUserViewModel extends sw_Paginator {
  @ApiProperty({
    description: "Items",
    nullable: false,
    isArray: true,
    type: TopUserViewModel
  })
  @ApiProperty()
  items: TopUserViewModel[];
};