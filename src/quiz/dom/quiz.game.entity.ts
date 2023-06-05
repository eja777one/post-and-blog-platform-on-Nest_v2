import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { QuizQuestion } from "./quiz.question.entity";
import { QuizPlayerProgress } from "./quiz.player.progress.entity";

@Entity()
export class QuizGame {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid", { nullable: false })
  firstPlayerProgressId: string;

  @Column("uuid", { nullable: true })
  secondPlayerProgressId: string;

  @Column("json", { nullable: false })
  questionsIds: string;

  @Column("character varying", { nullable: false })
  status: string;

  @Column("character varying", { nullable: false })
  pairCreatedDate: string;

  @Column("character varying", { nullable: true })
  startGameDate: string;

  @Column("character varying", { nullable: true })
  finishGameDate: string;

  @OneToOne(() => QuizPlayerProgress,
    (quizPlayerProgress) => quizPlayerProgress.id,
    { onDelete: "CASCADE" })
  firstPlayerProgress: QuizQuestion;

  @OneToOne(() => QuizPlayerProgress,
    (quizPlayerProgress) => quizPlayerProgress.id,
    { onDelete: "CASCADE" })
  secondPlayerProgress: QuizQuestion;
};