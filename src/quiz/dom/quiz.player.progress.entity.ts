import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { QuizGame } from "./quiz.game.entity";
import { Users } from "../../users/dom/users.entity";

@Entity()
export class QuizPlayerProgress {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("json", { nullable: false })
  answers: string;

  @Column("uuid", { nullable: true })
  playerId: string | null;

  @Column("uuid", { nullable: false })
  gameId: string;

  @Column("integer", { nullable: false, default: 0 })
  score: number;

  // @OneToOne(() => QuizGame,
  //   (quizGame) => quizGame.id, { onDelete: "CASCADE" })
  // @JoinColumn()
  // quizGame: QuizGame;

  @ManyToOne(() => Users, (user) => user.id,
    { onDelete: "CASCADE" })
  user: Users;
};